# @microfox/pinterest

TypeScript SDK for Pinterest API v5

## Installation

```bash
npm install @microfox/pinterest
```

## Usage

```typescript
import PinterestClient from '@microfox/pinterest';

// Initialize the client
const pinterest = new PinterestClient({
  accessToken: 'YOUR_ACCESS_TOKEN'
});

// Get current user
const user = await pinterest.getCurrentUser();
console.log(user);

// Create a new board
const board = await pinterest.createBoard('My New Board', 'Description of my board');
console.log(board);

// Create a new pin
const pin = await pinterest.createPin(board.id, {
  title: 'My New Pin',
  description: 'Description of my pin',
  link: 'https://example.com',
  media_source: {
    source_type: 'image_url',
    url: 'https://example.com/image.jpg'
  }
});
console.log(pin);

// Search for pins
const pins = await pinterest.searchPins('cats', 10);
console.log(pins);
```

## Features

- Full TypeScript support
- Comprehensive error handling
- Zod schema validation
- Support for Pinterest API v5
- Promise-based API

## API Reference

### User Endpoints
- `getCurrentUser()`: Get the current user's profile
- `getUserBoards(username)`: Get boards for a specific user

### Board Endpoints
- `getBoard(boardId)`: Get a specific board
- `createBoard(name, description?, privacy?)`: Create a new board

### Pin Endpoints
- `getPin(pinId)`: Get a specific pin
- `createPin(boardId, data)`: Create a new pin
- `deletePin(pinId)`: Delete a pin

### Search Endpoints
- `searchPins(query, pageSize?)`: Search for pins
- `searchBoards(query, pageSize?)`: Search for boards

## Error Handling

The SDK uses a custom `PinterestError` class for error handling:

```typescript
try {
  await pinterest.createPin(boardId, pinData);
} catch (error) {
  if (error instanceof PinterestError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
  }
}
```

## License

MIT 