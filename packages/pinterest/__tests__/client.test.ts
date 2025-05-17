import PinterestClient from '../src';
import { PinterestError, PinterestErrorCode } from '../src/errors';
import { CreatePinData, UpdateBoardData } from '../src/types';

describe('PinterestClient', () => {
  let client: PinterestClient;
  const mockAccessToken = 'test-token';

  beforeEach(() => {
    client = new PinterestClient({
      accessToken: mockAccessToken,
    });
  });

  describe('Authentication', () => {
    test('should initialize with access token', () => {
      expect(client).toBeInstanceOf(PinterestClient);
    });

    test('should throw error when access token is missing', () => {
      expect(() => new PinterestClient({})).toThrow(PinterestError);
    });
  });

  describe('Board Operations', () => {
    test('should create board successfully', async () => {
      const boardData = {
        name: 'Test Board',
        description: 'Test Description',
        privacy: 'PUBLIC' as const,
      };

      const mockResponse = {
        id: 'board-123',
        ...boardData,
      };

      jest.spyOn(client as any, 'request').mockResolvedValueOnce(mockResponse);

      const result = await client.createBoard(
        boardData.name,
        boardData.description,
        boardData.privacy
      );

      expect(result).toEqual(mockResponse);
    });

    test('should update board successfully', async () => {
      const boardId = 'board-123';
      const updateData: UpdateBoardData = {
        name: 'Updated Board',
        privacy: 'PROTECTED',
      };

      const mockResponse = {
        id: boardId,
        ...updateData,
      };

      jest.spyOn(client as any, 'request').mockResolvedValueOnce(mockResponse);

      const result = await client.updateBoard(boardId, updateData);
      expect(result).toEqual(mockResponse);
    });

    test('should get board successfully', async () => {
      const boardId = 'board-123';
      const mockResponse = {
        id: boardId,
        name: 'Test Board',
        description: 'Test Description',
        privacy: 'PUBLIC',
      };

      jest.spyOn(client as any, 'request').mockResolvedValueOnce(mockResponse);

      const result = await client.getBoard(boardId);
      expect(result).toEqual(mockResponse);
    });

    test('should delete board successfully', async () => {
      const boardId = 'board-123';
      jest.spyOn(client as any, 'request').mockResolvedValueOnce(undefined);

      await expect(client.deleteBoard(boardId)).resolves.not.toThrow();
    });
  });

  describe('Pin Operations', () => {
    test('should create pin successfully', async () => {
      const boardId = 'board-123';
      const pinData: CreatePinData = {
        title: 'Test Pin',
        description: 'Test Description',
        media_source: {
          source_type: 'image_url',
          url: 'https://example.com/image.jpg',
        },
      };

      const mockResponse = {
        id: 'pin-123',
        ...pinData,
      };

      jest.spyOn(client as any, 'request').mockResolvedValueOnce(mockResponse);

      const result = await client.createPin(boardId, pinData);
      expect(result).toEqual(mockResponse);
    });

    test('should get board pins with pagination', async () => {
      const boardId = 'board-123';
      const mockResponse = {
        items: [
          { id: 'pin-1', title: 'Pin 1' },
          { id: 'pin-2', title: 'Pin 2' },
        ],
        bookmark: 'next-page-token',
      };

      jest.spyOn(client as any, 'request').mockResolvedValueOnce(mockResponse);

      const result = await client.getBoardPins(boardId, { page_size: 2 });
      expect(result).toEqual(mockResponse.items);
    });

    test('should update pin successfully', async () => {
      const pinId = 'pin-123';
      const updateData: Partial<CreatePinData> = {
        title: 'Updated Pin',
      };

      const mockResponse = {
        id: pinId,
        ...updateData,
      };

      jest.spyOn(client as any, 'request').mockResolvedValueOnce(mockResponse);

      const result = await client.updatePin(pinId, updateData);
      expect(result).toEqual(mockResponse);
    });

    test('should delete pin successfully', async () => {
      const pinId = 'pin-123';
      jest.spyOn(client as any, 'request').mockResolvedValueOnce(undefined);

      await expect(client.deletePin(pinId)).resolves.not.toThrow();
    });

    test('should upload pin image successfully', async () => {
      const mockFile = new Blob(['test'], { type: 'image/jpeg' });
      const mockResponse = { media_id: 'media-123' };

      jest.spyOn(client as any, 'request').mockResolvedValueOnce(mockResponse);

      const result = await client.uploadPinImage(mockFile);
      expect(result).toBe('media-123');
    });
  });

  describe('Error Handling', () => {
    test('should handle rate limit errors', async () => {
      const error = new PinterestError(
        'Rate limit exceeded',
        PinterestErrorCode.RATE_LIMIT_EXCEEDED
      );

      jest.spyOn(client as any, 'request').mockRejectedValueOnce(error);

      await expect(client.getCurrentUser()).rejects.toThrow(PinterestError);
      await expect(client.getCurrentUser()).rejects.toMatchObject({
        code: PinterestErrorCode.RATE_LIMIT_EXCEEDED,
      });
    });

    test('should handle authentication errors', async () => {
      const error = new PinterestError('Invalid token', PinterestErrorCode.INVALID_TOKEN);

      jest.spyOn(client as any, 'request').mockRejectedValueOnce(error);

      await expect(client.getCurrentUser()).rejects.toThrow(PinterestError);
      await expect(client.getCurrentUser()).rejects.toMatchObject({
        code: PinterestErrorCode.INVALID_TOKEN,
      });
    });
  });

  describe('Event Emitters', () => {
    test('should emit request event', async () => {
      const mockResponse = { id: 'user-123', username: 'testuser' };
      jest.spyOn(client as any, 'request').mockResolvedValueOnce(mockResponse);

      const requestListener = jest.fn();
      client.on('request', requestListener);

      await client.getCurrentUser();
      expect(requestListener).toHaveBeenCalled();
    });

    test('should emit response event', async () => {
      const mockResponse = { id: 'user-123', username: 'testuser' };
      jest.spyOn(client as any, 'request').mockResolvedValueOnce(mockResponse);

      const responseListener = jest.fn();
      client.on('response', responseListener);

      await client.getCurrentUser();
      expect(responseListener).toHaveBeenCalled();
    });

    test('should emit error event', async () => {
      const error = new PinterestError('Test error', PinterestErrorCode.API_ERROR);
      jest.spyOn(client as any, 'request').mockRejectedValueOnce(error);

      const errorListener = jest.fn();
      client.on('error', errorListener);

      await expect(client.getCurrentUser()).rejects.toThrow();
      expect(errorListener).toHaveBeenCalledWith(error);
    });
  });
});
