# Examples

This guide provides comprehensive examples of using the Pinterest SDK.

## Basic Usage

### Initialize Client

```typescript
import PinterestClient from '@microfox/pinterest';

const pinterest = new PinterestClient(process.env.PINTEREST_ACCESS_TOKEN);
```

### Get Current User

```typescript
const user = await pinterest.getCurrentUser();
console.log('User:', user.username);
```

## Board Management

### Create a Board

```typescript
const board = await pinterest.createBoard(
  'My Inspiration Board',
  'A collection of inspiring images',
  'PUBLIC',
);
console.log('Created board:', board.name);
```

### Get User's Boards

```typescript
const boards = await pinterest.getUserBoards('username');
boards.forEach(board => {
  console.log(`${board.name} (${board.pin_count} pins)`);
});
```

### Update Board

```typescript
const updatedBoard = await pinterest.updateBoard(boardId, {
  name: 'Updated Board Name',
  description: 'New description',
  privacy: 'PROTECTED',
});
```

## Pin Management

### Create a Pin

```typescript
const pin = await pinterest.createPin(boardId, {
  title: 'Beautiful Sunset',
  description: 'A stunning sunset over the ocean',
  media_source: {
    source_type: 'image_url',
    url: 'https://example.com/sunset.jpg',
  },
});
```

### Get Pin Details

```typescript
const pin = await pinterest.getPin(pinId);
console.log('Pin title:', pin.title);
console.log('Pin description:', pin.description);
```

### Search Pins

```typescript
const pins = await pinterest.searchPins('nature photography', {
  page_size: 25,
  sort_by: 'recent',
});
```

## User Profile

### Get User Profile

```typescript
const user = await pinterest.getCurrentUser();
console.log({
  username: user.username,
  fullName: user.full_name,
  about: user.about,
  website: user.website_url,
});
```

### Get User's Pins

```typescript
const pins = await pinterest.getUserPins('username');
pins.forEach(pin => {
  console.log(`${pin.title} - ${pin.link}`);
});
```

## Error Handling

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

### Rate Limiting

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
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

// Usage
const pins = await withRetry(() => pinterest.searchPins('nature'));
```

## Advanced Examples

### Batch Operations

```typescript
async function createMultiplePins(
  boardId: string,
  pinDataList: CreatePinData[],
) {
  const results = await Promise.all(
    pinDataList.map(data => pinterest.createPin(boardId, data)),
  );
  return results;
}
```

### Pagination

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

// Usage
for await (const pin of getAllPins(boardId)) {
  console.log(pin.title);
}
```

### Caching

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

### Event Handling

```typescript
pinterest.on('request', request => {
  console.log('API Request:', {
    method: request.method,
    url: request.url,
    params: request.params,
  });
});

pinterest.on('response', response => {
  console.log('API Response:', {
    status: response.status,
    duration: response.duration,
  });
});
```

## Complete Application Example

```typescript
import PinterestClient from '@microfox/pinterest';
import { PinterestError } from '@microfox/pinterest';

class PinterestManager {
  private pinterest: PinterestClient;
  private cache: Map<string, any>;

  constructor(accessToken: string) {
    this.pinterest = new PinterestClient(accessToken);
    this.cache = new Map();
  }

  async createInspirationBoard(name: string, description: string) {
    try {
      const board = await this.pinterest.createBoard(
        name,
        description,
        'PUBLIC',
      );
      console.log('Created board:', board.name);
      return board;
    } catch (error) {
      if (error instanceof PinterestError) {
        console.error('Failed to create board:', error.message);
      }
      throw error;
    }
  }

  async addPinToBoard(boardId: string, pinData: CreatePinData) {
    try {
      const pin = await this.pinterest.createPin(boardId, pinData);
      this.cache.set(pin.id, pin);
      return pin;
    } catch (error) {
      if (error instanceof PinterestError) {
        console.error('Failed to create pin:', error.message);
      }
      throw error;
    }
  }

  async getBoardPins(boardId: string) {
    const pins: Pin[] = [];
    for await (const pin of this.getAllPins(boardId)) {
      pins.push(pin);
    }
    return pins;
  }

  private async *getAllPins(boardId: string) {
    let page = 1;
    while (true) {
      const pins = await this.pinterest.getBoardPins(boardId, { page });
      if (pins.length === 0) break;
      yield* pins;
      page++;
    }
  }
}

// Usage
async function main() {
  const manager = new PinterestManager(process.env.PINTEREST_ACCESS_TOKEN!);

  try {
    // Create a board
    const board = await manager.createInspirationBoard(
      'Design Inspiration',
      'A collection of beautiful designs',
    );

    // Add pins
    await manager.addPinToBoard(board.id, {
      title: 'Modern Design',
      description: 'A modern interior design',
      media_source: {
        source_type: 'image_url',
        url: 'https://example.com/design.jpg',
      },
    });

    // Get all pins
    const pins = await manager.getBoardPins(board.id);
    console.log(`Board has ${pins.length} pins`);
  } catch (error) {
    console.error('Error:', error);
  }
}
```
