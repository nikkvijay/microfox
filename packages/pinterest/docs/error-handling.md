# Error Handling

The Pinterest SDK provides comprehensive error handling through the `PinterestError` class.

## Error Types

### PinterestError

The base error class for all Pinterest API errors.

```typescript
class PinterestError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: PinterestErrorCode,
    public details?: any,
  ) {
    super(message);
    this.name = 'PinterestError';
  }
}
```

### Error Codes

```typescript
enum PinterestErrorCode {
  // Authentication Errors
  INVALID_TOKEN = 'invalid_token',
  TOKEN_EXPIRED = 'token_expired',
  INSUFFICIENT_SCOPES = 'insufficient_scopes',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',

  // Resource Errors
  RESOURCE_NOT_FOUND = 'resource_not_found',
  INVALID_RESOURCE = 'invalid_resource',
  DUPLICATE_RESOURCE = 'duplicate_resource',

  // Permission Errors
  PERMISSION_DENIED = 'permission_denied',
  BOARD_NOT_ACCESSIBLE = 'board_not_accessible',

  // Validation Errors
  INVALID_PARAMETER = 'invalid_parameter',
  MISSING_REQUIRED_FIELD = 'missing_required_field',

  // API Errors
  INTERNAL_ERROR = 'internal_error',
  SERVICE_UNAVAILABLE = 'service_unavailable',
}
```

## Error Handling Examples

### Basic Error Handling

```typescript
try {
  await pinterest.createPin(boardId, pinData);
} catch (error) {
  if (error instanceof PinterestError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
  }
}
```

### Specific Error Types

```typescript
try {
  await pinterest.createPin(boardId, pinData);
} catch (error) {
  if (error instanceof PinterestError) {
    if (error.isAuthenticationError()) {
      // Handle authentication errors
      console.error('Authentication error:', error.message);
    } else if (error.isRateLimitError()) {
      // Handle rate limiting
      console.error('Rate limit exceeded:', error.message);
    } else if (error.isResourceError()) {
      // Handle resource errors
      console.error('Resource error:', error.message);
    } else if (error.isPermissionError()) {
      // Handle permission errors
      console.error('Permission error:', error.message);
    } else if (error.isValidationError()) {
      // Handle validation errors
      console.error('Validation error:', error.message);
    }
  }
}
```

### Error Helper Methods

The `PinterestError` class provides helper methods to check error types:

```typescript
error.isAuthenticationError(); // Check for auth-related errors
error.isRateLimitError(); // Check for rate limiting errors
error.isResourceError(); // Check for resource-related errors
error.isPermissionError(); // Check for permission-related errors
error.isValidationError(); // Check for validation errors
```

## Common Error Scenarios

### Authentication Errors

```typescript
try {
  await pinterest.getCurrentUser();
} catch (error) {
  if (error instanceof PinterestError && error.isAuthenticationError()) {
    // Token might be invalid or expired
    console.error('Please check your access token');
  }
}
```

### Rate Limiting

```typescript
try {
  await pinterest.searchPins('nature');
} catch (error) {
  if (error instanceof PinterestError && error.isRateLimitError()) {
    // Implement exponential backoff
    const retryAfter = error.details?.retry_after || 60;
    console.log(`Rate limited. Retry after ${retryAfter} seconds`);
  }
}
```

### Resource Not Found

```typescript
try {
  await pinterest.getPin('non-existent-pin');
} catch (error) {
  if (
    error instanceof PinterestError &&
    error.code === PinterestErrorCode.RESOURCE_NOT_FOUND
  ) {
    console.error('Pin not found');
  }
}
```

## Best Practices

1. **Always Check Error Types**

   ```typescript
   try {
     await pinterest.createPin(boardId, pinData);
   } catch (error) {
     if (error instanceof PinterestError) {
       // Handle Pinterest-specific errors
     } else {
       // Handle other errors
     }
   }
   ```

2. **Use Error Helper Methods**

   ```typescript
   if (error.isAuthenticationError()) {
     // Handle auth errors
   }
   ```

3. **Implement Retry Logic**

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
           await new Promise(resolve => setTimeout(resolve, 1000 * retries));
           continue;
         }
         throw error;
       }
     }
   }
   ```

4. **Log Error Details**
   ```typescript
   try {
     await pinterest.createPin(boardId, pinData);
   } catch (error) {
     if (error instanceof PinterestError) {
       console.error({
         message: error.message,
         code: error.code,
         statusCode: error.statusCode,
         details: error.details,
       });
     }
   }
   ```
