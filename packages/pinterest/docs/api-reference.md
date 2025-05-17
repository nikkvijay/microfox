# API Reference

## PinterestClient

The main client class for interacting with the Pinterest API.

```typescript
import PinterestClient from '@microfox/pinterest';

const pinterest = new PinterestClient({
  accessToken: 'YOUR_ACCESS_TOKEN',
  apiVersion?: 'v5', // optional
  baseURL?: 'https://api.pinterest.com' // optional
});
```

## User Endpoints

### getCurrentUser()

Get the current user's profile information.

```typescript
const user = await pinterest.getCurrentUser();
// Returns: User
```

### getUserBoards(username: string)

Get all boards for a specific user.

```typescript
const boards = await pinterest.getUserBoards('username');
// Returns: Board[]
```

## Board Endpoints

### getBoard(boardId: string)

Get details for a specific board.

```typescript
const board = await pinterest.getBoard('board_id');
// Returns: Board
```

### createBoard(name: string, description?: string, privacy?: 'PUBLIC' | 'PROTECTED' | 'SECRET')

Create a new board.

```typescript
const board = await pinterest.createBoard(
  'My Board',
  'Board description',
  'PUBLIC',
);
// Returns: Board
```

## Pin Endpoints

### getPin(pinId: string)

Get details for a specific pin.

```typescript
const pin = await pinterest.getPin('pin_id');
// Returns: Pin
```

### createPin(boardId: string, data: CreatePinData)

Create a new pin.

```typescript
const pin = await pinterest.createPin('board_id', {
  title: 'My Pin',
  description: 'Pin description',
  link: 'https://example.com',
  media_source: {
    source_type: 'image_url',
    url: 'https://example.com/image.jpg',
  },
});
// Returns: Pin
```

### deletePin(pinId: string)

Delete a pin.

```typescript
await pinterest.deletePin('pin_id');
// Returns: void
```

## Search Endpoints

### searchPins(query: string, pageSize?: number)

Search for pins.

```typescript
const pins = await pinterest.searchPins('nature', 25);
// Returns: Pin[]
```

### searchBoards(query: string, pageSize?: number)

Search for boards.

```typescript
const boards = await pinterest.searchBoards('design', 25);
// Returns: Board[]
```

## Types

### User

```typescript
interface User {
  id: string;
  username: string;
  full_name: string;
  about?: string;
  website_url?: string;
  profile_image?: string;
}
```

### Board

```typescript
interface Board {
  id: string;
  name: string;
  description?: string;
  privacy: 'PUBLIC' | 'PROTECTED' | 'SECRET';
  pin_count: number;
  follower_count: number;
}
```

### Pin

```typescript
interface Pin {
  id: string;
  link?: string;
  title?: string;
  description?: string;
  dominant_color?: string;
  alt_text?: string;
  board_id: string;
  board_section_id?: string;
  parent_pin_id?: string;
  media_source?: {
    source_type: string;
    url: string;
  };
}
```

### CreatePinData

```typescript
interface CreatePinData {
  title?: string;
  description?: string;
  link?: string;
  media_source: {
    source_type: string;
    url: string;
  };
}
```

## Error Handling

All methods throw a `PinterestError` when an error occurs:

```typescript
try {
  await pinterest.createPin(boardId, pinData);
} catch (error) {
  if (error instanceof PinterestError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
  }
}
```

## Rate Limiting

The SDK automatically handles rate limiting by:

- Respecting Pinterest's rate limits
- Implementing exponential backoff
- Retrying failed requests when appropriate

## Pagination

For endpoints that return multiple items, you can control the page size:

```typescript
// Get 50 pins instead of the default 25
const pins = await pinterest.searchPins('nature', 50);
```
