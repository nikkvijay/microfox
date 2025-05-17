# Pinterest SDK Features

## Core Features

### 1. Error Handling

The SDK provides comprehensive error handling with the `PinterestError` class:

```typescript
try {
  await pinterest.createPin(boardId, pinData);
} catch (error) {
  if (error instanceof PinterestError) {
    // Check specific error types
    if (error.isAuthenticationError()) {
      // Handle authentication errors
    } else if (error.isRateLimitError()) {
      // Handle rate limit errors
    }
  }
}
```

Error types include:

- Authentication errors (`INVALID_TOKEN`, `TOKEN_EXPIRED`)
- Rate limiting errors (`RATE_LIMIT_EXCEEDED`)
- Resource errors (`RESOURCE_NOT_FOUND`)
- Permission errors (`PERMISSION_DENIED`)
- Validation errors (`VALIDATION_ERROR`)

### 2. Rate Limiting

Built-in rate limiting to prevent API throttling:

```typescript
// Rate limiter configuration
private rateLimiter = {
  requests: 0,
  resetTime: Date.now(),
  maxRequests: 100,
  timeWindow: 3600000 // 1 hour
};
```

The SDK automatically:

- Tracks request counts
- Enforces rate limits
- Resets counters after the time window
- Throws `RATE_LIMIT_EXCEEDED` errors when limits are reached

### 3. Pagination Support

Automatic pagination handling for list endpoints:

```typescript
// Get all boards with pagination
const boards = await pinterest.getUserBoards('username', {
  page_size: 25,
  page: 1,
});

// Get all pins with pagination
const pins = await pinterest.getBoardPins(boardId, {
  page_size: 50,
  bookmark: 'next_page_token',
});
```

Features:

- Cursor-based pagination
- Configurable page sizes
- Automatic page traversal
- Bookmark support

### 4. Event Emitters

Event-based monitoring and logging:

```typescript
pinterest.on('request', config => {
  console.log('Making request:', config.url);
});

pinterest.on('response', response => {
  console.log('Received response:', response.status);
});

pinterest.on('error', error => {
  console.error('Error occurred:', error.message);
});
```

Available events:

- `request`: Emitted before each API request
- `response`: Emitted after successful responses
- `error`: Emitted when errors occur

### 5. Type Safety

Comprehensive TypeScript support:

```typescript
// Type-safe pin creation
const pinData: CreatePinData = {
  title: 'My Pin',
  description: 'Pin description',
  media_source: {
    source_type: 'image_url',
    url: 'https://example.com/image.jpg',
  },
};

// Type-safe board update
const boardData: UpdateBoardData = {
  name: 'Updated Board',
  privacy: 'PUBLIC',
};
```

Features:

- Zod schema validation
- Type guards
- Interface definitions
- Generic type support

### 6. New Endpoints

Additional API endpoints:

```typescript
// Update board
await pinterest.updateBoard(boardId, {
  name: 'New Name',
  privacy: 'PUBLIC',
});

// Get board pins
const pins = await pinterest.getBoardPins(boardId);

// Get user pins
const userPins = await pinterest.getUserPins(username);

// Upload pin image
const mediaId = await pinterest.uploadPinImage(imageBuffer);
```

### 7. Request/Response Handling

Enhanced request and response handling:

```typescript
// Request validation
validateCreatePinData(pinData);
validateUpdateBoardData(boardData);

// Response type checking
const response = await pinterest.getCurrentUser();
// response is typed as User
```

Features:

- Request parameter validation
- Response type checking
- Error transformation
- Axios interceptors

## Best Practices

1. **Error Handling**

```typescript
try {
  await pinterest.createPin(boardId, pinData);
} catch (error) {
  if (error instanceof PinterestError) {
    switch (error.code) {
      case PinterestErrorCode.RATE_LIMIT_EXCEEDED:
        // Implement retry logic
        break;
      case PinterestErrorCode.VALIDATION_ERROR:
        // Handle validation errors
        break;
    }
  }
}
```

2. **Rate Limiting**

```typescript
// Monitor rate limit events
pinterest.on('error', error => {
  if (error instanceof PinterestError && error.isRateLimitError()) {
    // Implement backoff strategy
  }
});
```

3. **Pagination**

```typescript
// Efficient pagination
const allPins = await pinterest.getBoardPins(boardId, {
  page_size: 100, // Larger page size for fewer requests
});
```

4. **Event Monitoring**

```typescript
// Log all API interactions
pinterest.on('request', config => {
  console.log(
    `[${new Date().toISOString()}] ${config.method?.toUpperCase()} ${config.url}`,
  );
});

pinterest.on('response', response => {
  console.log(
    `[${new Date().toISOString()}] ${response.status} ${response.config.url}`,
  );
});
```

5. **Type Safety**

```typescript
// Use type guards
function isPin(data: any): data is Pin {
  return PinSchema.safeParse(data).success;
}

// Validate data before use
if (isPin(response.data)) {
  // Safe to use as Pin
}
```
