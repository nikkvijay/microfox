# Authentication

This guide covers authentication methods for the Pinterest SDK.

## Access Tokens

### Getting an Access Token

1. **Create a Pinterest App**

   - Go to [Pinterest Developer Portal](https://developers.pinterest.com/)
   - Create a new app
   - Get your app ID and secret

2. **Request Access Token**

   ```typescript
   import PinterestClient from '@microfox/pinterest';

   const pinterest = new PinterestClient({
     clientId: 'your_client_id',
     clientSecret: 'your_client_secret',
   });

   const token = await pinterest.getAccessToken({
     code: 'authorization_code',
     redirectUri: 'your_redirect_uri',
   });
   ```

### Using Access Tokens

```typescript
// Initialize client with access token
const pinterest = new PinterestClient(accessToken);

// Make authenticated requests
const user = await pinterest.getCurrentUser();
```

## OAuth Flow

1. **Get Authorization URL**

   ```typescript
   const authUrl = pinterest.getAuthorizationUrl({
     redirectUri: 'your_redirect_uri',
     scopes: ['boards:read', 'pins:read', 'pins:write'],
   });
   ```

2. **Handle OAuth Callback**
   ```typescript
   // In your callback handler
   const code = req.query.code;
   const token = await pinterest.getAccessToken({
     code,
     redirectUri: 'your_redirect_uri',
   });
   ```

## Scopes

Available scopes for Pinterest API:

```typescript
const scopes = [
  'boards:read', // Read board information
  'boards:write', // Create and modify boards
  'pins:read', // Read pin information
  'pins:write', // Create and modify pins
  'user_accounts:read', // Read user account information
];
```

## Token Management

### Storing Tokens

```typescript
// Store token securely
const token = await pinterest.getAccessToken(/* ... */);
await saveTokenToDatabase(token);

// Use stored token
const savedToken = await getTokenFromDatabase();
const pinterest = new PinterestClient(savedToken);
```

### Refreshing Tokens

```typescript
try {
  await pinterest.getCurrentUser();
} catch (error) {
  if (
    error instanceof PinterestError &&
    error.code === PinterestErrorCode.TOKEN_EXPIRED
  ) {
    const newToken = await pinterest.refreshToken(refreshToken);
    pinterest.setAccessToken(newToken);
  }
}
```

## Security Best Practices

1. **Never Expose Credentials**

   ```typescript
   // Good
   const accessToken = process.env.PINTEREST_ACCESS_TOKEN;

   // Bad
   const accessToken = 'your_access_token';
   ```

2. **Use Environment Variables**

   ```bash
   # .env
   PINTEREST_CLIENT_ID=your_client_id
   PINTEREST_CLIENT_SECRET=your_client_secret
   PINTEREST_REDIRECT_URI=your_redirect_uri
   ```

3. **Validate Tokens**
   ```typescript
   async function validateToken(token: string): Promise<boolean> {
     try {
       const pinterest = new PinterestClient(token);
       await pinterest.getCurrentUser();
       return true;
     } catch (error) {
       return false;
     }
   }
   ```

## Error Handling

### Authentication Errors

```typescript
try {
  await pinterest.getCurrentUser();
} catch (error) {
  if (error instanceof PinterestError) {
    if (error.isAuthenticationError()) {
      // Handle authentication errors
      console.error('Authentication error:', error.message);
    }
  }
}
```

### Common Error Codes

```typescript
enum PinterestErrorCode {
  INVALID_TOKEN = 'invalid_token',
  TOKEN_EXPIRED = 'token_expired',
  INSUFFICIENT_SCOPES = 'insufficient_scopes',
}
```

## Examples

### Complete OAuth Flow

```typescript
import PinterestClient from '@microfox/pinterest';

// Initialize client
const pinterest = new PinterestClient({
  clientId: process.env.PINTEREST_CLIENT_ID,
  clientSecret: process.env.PINTEREST_CLIENT_SECRET,
});

// Get authorization URL
const authUrl = pinterest.getAuthorizationUrl({
  redirectUri: process.env.PINTEREST_REDIRECT_URI,
  scopes: ['boards:read', 'pins:read'],
});

// Handle callback
async function handleCallback(code: string) {
  try {
    const token = await pinterest.getAccessToken({
      code,
      redirectUri: process.env.PINTEREST_REDIRECT_URI,
    });

    // Store token
    await saveTokenToDatabase(token);

    // Use token
    const client = new PinterestClient(token.access_token);
    const user = await client.getCurrentUser();
    console.log('Authenticated as:', user.username);
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}
```
