import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { EventEmitter } from 'events';
import {
  PinterestConfig,
  User,
  Board,
  Pin,
  CreatePinData,
  UpdateBoardData,
  PaginationOptions,
  PaginatedResponse,
  validateCreatePinData,
  validateUpdateBoardData,
} from './types';
import { PinterestError, PinterestErrorCode } from './errors';

export default class PinterestClient extends EventEmitter {
  private client: AxiosInstance;
  private accessToken: string;
  private baseUrl: string;
  private rateLimiter = {
    requests: 0,
    resetTime: Date.now(),
    maxRequests: 100,
    timeWindow: 3600000, // 1 hour
  };

  constructor(config: PinterestConfig) {
    super();
    if (!config.accessToken) {
      throw new PinterestError(
        'Access token is required',
        PinterestErrorCode.INVALID_TOKEN,
      );
    }
    this.accessToken = config.accessToken;
    this.baseUrl = config.baseURL || 'https://api.pinterest.com/v5';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      config => {
        this.emit('request', config);
        return config;
      },
      error => {
        this.emit('error', error);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      response => {
        this.emit('response', response);
        return response;
      },
      error => {
        const pinterestError = new PinterestError(
          error.message,
          error.response?.status,
          undefined,
          error.response?.data
        );
        this.emit('error', pinterestError);
        return Promise.reject(pinterestError);
      },
    );
  }

  private async checkRateLimit() {
    const now = Date.now();
    if (now > this.rateLimiter.resetTime) {
      this.rateLimiter.requests = 0;
      this.rateLimiter.resetTime = now + this.rateLimiter.timeWindow;
    }

    if (this.rateLimiter.requests >= this.rateLimiter.maxRequests) {
      throw new PinterestError(
        'Rate limit exceeded',
        429,
        PinterestErrorCode.RATE_LIMIT_EXCEEDED,
      );
    }

    this.rateLimiter.requests++;
  }

  private async paginate<T>(
    url: string,
    options?: PaginationOptions,
  ): Promise<T[]> {
    const items: T[] = [];
    let currentPage = options?.page || 1;
    let hasMore = true;

    while (hasMore) {
      await this.checkRateLimit();
      const response = await this.client.get<PaginatedResponse<T>>(url, {
        params: { ...options, page: currentPage },
      });

      items.push(...response.data.items);
      hasMore = response.data.has_more;
      currentPage++;
    }

    return items;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    await this.checkRateLimit();
    const response = await this.client.request<T>(config);
    return response.data;
  }

  // User Endpoints
  async getCurrentUser(): Promise<User> {
    await this.checkRateLimit();
    const response = await this.client.get<User>('/user');
    return response.data;
  }

  async getUserBoards(
    username: string,
    options?: PaginationOptions,
  ): Promise<Board[]> {
    return this.paginate<Board>(`/users/${username}/boards`, options);
  }

  async getUserPins(
    username: string,
    options?: PaginationOptions,
  ): Promise<Pin[]> {
    return this.paginate<Pin>(`/users/${username}/pins`, options);
  }

  // Board Endpoints
  async getBoard(boardId: string): Promise<Board> {
    await this.checkRateLimit();
    const response = await this.client.get<Board>(`/boards/${boardId}`);
    return response.data;
  }

  async createBoard(
    name: string,
    description?: string,
    privacy: 'PUBLIC' | 'PROTECTED' | 'SECRET' = 'PUBLIC',
  ): Promise<Board> {
    await this.checkRateLimit();
    const response = await this.client.post<Board>('/boards', {
      name,
      description,
      privacy,
    });
    return response.data;
  }

  async updateBoard(boardId: string, data: UpdateBoardData): Promise<Board> {
    validateUpdateBoardData(data);
    await this.checkRateLimit();
    const response = await this.client.patch<Board>(`/boards/${boardId}`, data);
    return response.data;
  }

  async getBoardPins(
    boardId: string,
    options?: PaginationOptions,
  ): Promise<Pin[]> {
    return this.paginate<Pin>(`/boards/${boardId}/pins`, options);
  }

  // Pin Endpoints
  async getPin(pinId: string): Promise<Pin> {
    await this.checkRateLimit();
    const response = await this.client.get<Pin>(`/pins/${pinId}`);
    return response.data;
  }

  async createPin(boardId: string, data: CreatePinData): Promise<Pin> {
    validateCreatePinData(data);
    await this.checkRateLimit();
    const response = await this.client.post<Pin>(
      `/boards/${boardId}/pins`,
      data,
    );
    return response.data;
  }

  async deletePin(pinId: string): Promise<void> {
    await this.checkRateLimit();
    await this.client.delete(`/pins/${pinId}`);
  }

  async uploadPinImage(file: Buffer | Blob): Promise<string> {
    await this.checkRateLimit();
    const formData = new FormData();
    
    if (file instanceof Buffer) {
      const blob = new Blob([file], { type: 'application/octet-stream' });
      formData.append('file', blob, 'image.jpg');
    } else if (file instanceof Blob) {
      formData.append('file', file, 'image.jpg');
    } else {
      throw new PinterestError(
        'Invalid file type. Expected Buffer or Blob',
        PinterestErrorCode.VALIDATION_ERROR
      );
    }

    const response = await this.client.post<{ media_id: string }>(
      '/media/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data.media_id;
  }

  // Search Endpoints
  async searchPins(query: string, pageSize?: number): Promise<Pin[]> {
    return this.paginate<Pin>('/search/pins', {
      page_size: pageSize,
      params: { query },
    });
  }

  async searchBoards(query: string, pageSize?: number): Promise<Board[]> {
    return this.paginate<Board>('/search/boards', {
      page_size: pageSize,
      params: { query },
    });
  }

  async updatePin(pinId: string, pinData: Partial<CreatePinData>): Promise<Pin> {
    return this.request<Pin>({
      method: 'PATCH',
      url: `/pins/${pinId}`,
      data: pinData,
    });
  }

  async deleteBoard(boardId: string): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/boards/${boardId}`,
    });
  }
}
