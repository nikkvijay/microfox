import { z } from 'zod';
import {
  FormMetadata,
  SubmissionResponse,
  SingleSubmissionResponse,
  WebhookCreateResponse,
  CreateSubmissionsResponse,
  FilloutSDKOptions,
  Form,
  Submission,
} from './types';
import { formSchema, submissionResponseSchema, singleSubmissionResponseSchema, webhookCreateResponseSchema, createSubmissionsResponseSchema } from './schemas';

const BASE_URL = 'https://api.fillout.com';

export class FilloutSDK {
  private apiKey: string;

  constructor(options?: FilloutSDKOptions) {
    this.apiKey = options?.apiKey || process.env.FILLOUT_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('API key is required. Please provide it in the constructor or set the FILLOUT_API_KEY environment variable.');
    }
  }

  private async request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as T;
  }

  async getForms(): Promise<Form[]> {
    const response = await this.request<Form[]>('/v1/api/forms');
    return response;
  }

  async getFormMetadata(formId: string): Promise<FormMetadata> {
    const response = await this.request<FormMetadata>(`/v1/api/forms/${formId}`);
    return formSchema.parse(response);
  }

  async getAllSubmissions(formId: string, options?: {
    limit?: number;
    afterDate?: string;
    beforeDate?: string;
    offset?: number;
    status?: 'in_progress';
    includeEditLink?: boolean;
    includePreview?: boolean;
    sort?: 'asc' | 'desc';
    search?: string;
  }): Promise<SubmissionResponse> {
    const queryParams = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await this.request<SubmissionResponse>(`/v1/api/forms/${formId}/submissions?${queryParams.toString()}`);
    return submissionResponseSchema.parse(response);
  }

  async getSubmissionById(formId: string, submissionId: string, includeEditLink?: boolean): Promise<SingleSubmissionResponse> {
    const queryParams = new URLSearchParams();
    if (includeEditLink) {
      queryParams.append('includeEditLink', 'true');
    }
    const response = await this.request<SingleSubmissionResponse>(`/v1/api/forms/${formId}/submissions/${submissionId}?${queryParams.toString()}`);
    return singleSubmissionResponseSchema.parse(response);
  }

  async deleteSubmissionById(formId: string, submissionId: string): Promise<void> {
    await this.request(`/v1/api/forms/${formId}/submissions/${submissionId}`, 'DELETE');
  }

  async createWebhook(formId: string, url: string): Promise<WebhookCreateResponse> {
    const response = await this.request<WebhookCreateResponse>('/v1/api/webhook/create', 'POST', { formId, url });
    return webhookCreateResponseSchema.parse(response);
  }

  async removeWebhook(webhookId: number): Promise<void> {
    await this.request('/v1/api/webhook/delete', 'POST', { webhookId });
  }

  async createSubmissions(formId: string, submissions: Submission[]): Promise<CreateSubmissionsResponse> {
    if (submissions.length > 10) {
      throw new Error('Maximum 10 submissions allowed per request');
    }
    const response = await this.request<CreateSubmissionsResponse>(`/v1/api/forms/${formId}/submissions`, 'POST', { submissions });
    return createSubmissionsResponseSchema.parse(response);
  }
}

export function createFilloutSDK(options?: FilloutSDKOptions): FilloutSDK {
  return new FilloutSDK(options);
}
