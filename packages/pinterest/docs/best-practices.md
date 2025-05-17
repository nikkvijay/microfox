# Best Practices

This guide outlines best practices for using the Pinterest SDK effectively and efficiently.

## Authentication

### Access Token Management

1. **Store Tokens Securely**

   ```typescript
   // Use environment variables or secure storage
   const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
   const pinterest = new PinterestClient(accessToken);
   ```

2. **Handle Token Expiration**

   ```typescript
   try {
     await pinterest.getCurrentUser();
   } catch (error) {
     if (
       error instanceof PinterestError &&
       error.code === PinterestErrorCode.TOKEN_EXPIRED
     ) {
       // Implement token refresh logic
       const newToken = await refreshToken();
       pinterest.setAccessToken(newToken);
     }
   }
   ```

3. **Use Appropriate Scopes**
   ```typescript
   // Request only the scopes you need
   const scopes = ['boards:read', 'pins:read', 'pins:write'];
   ```

## Rate Limiting

1. **Implement Exponential Backoff**

   ```typescript
   async function withRetry<T>(
     fn: () => Promise<T>,
     maxRetries = 3,
   ): Promise<T> {
     let retries = 0;
     while (true) {
       try {
         return await fn();
       } catch (error) {
         if (error instanceof PinterestError && error.isRateLimitError()) {
           if (retries >= maxRetries) throw error;
           retries++;
           await new Promise(resolve =>
             setTimeout(resolve, 1000 * Math.pow(2, retries)),
           );
           continue;
         }
         throw error;
       }
     }
   }
   ```

2. **Batch Operations**
   ```typescript
   // Instead of multiple individual requests
   const pins = await Promise.all(pinIds.map(id => pinterest.getPin(id)));
   ```

## Error Handling

1. **Use Type Guards**

   ```typescript
   if (error instanceof PinterestError) {
     // Handle Pinterest-specific errors
   }
   ```

2. **Implement Proper Error Logging**
   ```typescript
   try {
     await pinterest.createPin(boardId, pinData);
   } catch (error) {
     if (error instanceof PinterestError) {
       logger.error({
         message: error.message,
         code: error.code,
         statusCode: error.statusCode,
         details: error.details,
       });
     }
   }
   ```

## Resource Management

1. **Clean Up Resources**

   ```typescript
   // Delete test resources after use
   try {
     await pinterest.createPin(boardId, testPinData);
     // Use the pin
   } finally {
     await pinterest.deletePin(pinId);
   }
   ```

2. **Handle Pagination Efficiently**
   ```typescript
   async function* getAllPins(boardId: string) {
     let page = 1;
     while (true) {
       const pins = await pinterest.getBoardPins(boardId, { page });
       if (pins.length === 0) break;
       yield* pins;
       page++;
     }
   }
   ```

## Performance Optimization

1. **Use Caching**

   ```typescript
   const cache = new Map<string, any>();

   async function getCachedPin(pinId: string) {
     if (cache.has(pinId)) {
       return cache.get(pinId);
     }
     const pin = await pinterest.getPin(pinId);
     cache.set(pinId, pin);
     return pin;
   }
   ```

2. **Optimize Image Uploads**
   ```typescript
   // Compress images before upload
   const compressedImage = await compressImage(imageBuffer);
   await pinterest.createPin(boardId, {
     ...pinData,
     image: compressedImage,
   });
   ```

## Security

1. **Validate Input**

   ```typescript
   function validatePinData(data: CreatePinData) {
     if (!data.title || data.title.length > 100) {
       throw new Error('Invalid title');
     }
     if (!data.image) {
       throw new Error('Image is required');
     }
   }
   ```

2. **Sanitize User Input**
   ```typescript
   function sanitizeSearchQuery(query: string) {
     return query.replace(/[<>]/g, '');
   }
   ```

## Testing

1. **Use Mock Responses**

   ```typescript
   const mockPin = {
     id: '123',
     title: 'Test Pin',
     // ... other pin properties
   };

   jest.spyOn(pinterest, 'getPin').mockResolvedValue(mockPin);
   ```

2. **Test Error Scenarios**
   ```typescript
   test('handles rate limiting', async () => {
     const error = new PinterestError(
       'Rate limit exceeded',
       429,
       PinterestErrorCode.RATE_LIMIT_EXCEEDED,
     );
     jest.spyOn(pinterest, 'searchPins').mockRejectedValue(error);

     await expect(pinterest.searchPins('test')).rejects.toThrow(PinterestError);
   });
   ```

## Code Organization

1. **Use TypeScript Types**

   ```typescript
   import { Pin, Board, CreatePinData } from '@microfox/pinterest';

   async function createPinWithValidation(
     boardId: string,
     data: CreatePinData,
   ): Promise<Pin> {
     validatePinData(data);
     return pinterest.createPin(boardId, data);
   }
   ```

2. **Implement Proper Logging**
   ```typescript
   const logger = {
     info: (message: string, data?: any) => {
       console.log(`[INFO] ${message}`, data);
     },
     error: (message: string, error?: any) => {
       console.error(`[ERROR] ${message}`, error);
     },
   };
   ```

## Monitoring and Debugging

1. **Add Request Logging**

   ```typescript
   pinterest.on('request', request => {
     logger.info('API Request', {
       method: request.method,
       url: request.url,
       params: request.params,
     });
   });
   ```

2. **Track Performance Metrics**

   ```typescript
   const metrics = {
     requestCount: 0,
     errorCount: 0,
     totalResponseTime: 0,
   };

   pinterest.on('response', response => {
     metrics.requestCount++;
     metrics.totalResponseTime += response.duration;
   });
   ```
