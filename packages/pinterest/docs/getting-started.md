# Getting Started

This guide will help you get started with the Pinterest SDK.

## Installation

```bash
# Using npm
npm install @microfox/pinterest

# Using yarn
yarn add @microfox/pinterest

# Using pnpm
pnpm add @microfox/pinterest
```

## Configuration

1. **Get Pinterest API Credentials**

   - Go to [Pinterest Developer Portal](https://developers.pinterest.com/)
   - Create a new app
   - Get your access token

2. **Set Up Environment Variables**
   ```bash
   # .env
   PINTEREST_ACCESS_TOKEN=your_access_token
   ```

## Basic Usage

1. **Initialize the Client**

   ```typescript
   import PinterestClient from '@microfox/pinterest';

   const pinterest = new PinterestClient(process.env.PINTEREST_ACCESS_TOKEN);
   ```

2. **Get Current User**

   ```typescript
   const user = await pinterest.getCurrentUser();
   console.log(user);
   ```

3. **Create a Board**

   ```typescript
   const board = await pinterest.createBoard(
     'My Board',
     'Board description',
     'PUBLIC',
   );
   ```

4. **Create a Pin**
   ```typescript
   const pin = await pinterest.createPin(board.id, {
     title: 'My Pin',
     description: 'Pin description',
     media_source: {
       source_type: 'image_url',
       url: 'https://example.com/image.jpg',
     },
   });
   ```

## TypeScript Support

The SDK is written in TypeScript and provides full type support:

```typescript
import {
  PinterestClient,
  Pin,
  Board,
  CreatePinData,
} from '@microfox/pinterest';

const pinterest = new PinterestClient(accessToken);

// TypeScript will provide autocomplete and type checking
const pin: Pin = await pinterest.getPin(pinId);
```

## Error Handling

```typescript
try {
  await pinterest.createPin(boardId, pinData);
} catch (error) {
  if (error instanceof PinterestError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
  }
}
```

## Next Steps

- Read the [API Reference](./api-reference.md) for detailed endpoint documentation
- Check out the [Examples](./examples.md) for more usage examples
- Learn about [Error Handling](./error-handling.md) for robust error management
- Review [Best Practices](./best-practices.md) for optimal usage
