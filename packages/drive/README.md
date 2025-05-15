# Google Drive SDK for Microfox

A robust TypeScript SDK for interacting with the Google Drive API, complete with built-in OAuth token management.

## Features

- Full-featured Google Drive API client
- Automatic token validation and refresh via `@microfox/google`
- Strong typing with Zod validation
- Comprehensive file and folder operations
- Permission management
- Revision history and comments
- Detailed token status information for robust error handling

## Installation

```bash
npm install @microfox/drive
```

## Usage

### Basic Usage with Access Token

```typescript
import { createDriveSDK } from '@microfox/drive';

// Create a Drive SDK instance with a valid access token
const driveSDK = createDriveSDK({
  accessToken: 'your-google-drive-access-token',
});

// List files in Drive
const files = await driveSDK.listFiles();
console.log(files);
```

### With Token Management

```typescript
import { createDriveSDKWithTokens } from '@microfox/drive';

// Create a Drive SDK instance with token management
const driveSDK = await createDriveSDKWithTokens({
  driveAccessToken: process.env.DRIVE_ACCESS_TOKEN,
  driveRefreshToken: process.env.DRIVE_REFRESH_TOKEN,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

// SDK will automatically handle token validation and refresh
// It will throw a DriveAuthError if tokens are invalid and cannot be refreshed
try {
  const files = await driveSDK.listFiles();
  console.log(files);

  // You can access token information if needed
  console.log(driveSDK.tokens.accessTokenStatus);
} catch (error) {
  if (error instanceof DriveAuthError) {
    // Handle authentication errors specifically
    console.error(`Auth error: ${error.tokenInfo.errorMessage}`);
    console.log(`Access token status: ${error.tokenInfo.accessTokenStatus}`);
    console.log(`Refresh token status: ${error.tokenInfo.refreshTokenStatus}`);
  } else {
    // Handle other API errors
    console.error(`API error: ${error.message}`);
  }
}
```

### Environment Variables

You can also use environment variables for authentication:

```
DRIVE_ACCESS_TOKEN=your-access-token
DRIVE_REFRESH_TOKEN=your-refresh-token
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## API Reference

### File Operations

```typescript
// List files
const files = await driveSDK.listFiles({
  pageSize: 10,
  orderBy: 'modifiedTime desc',
  q: "mimeType='application/pdf'",
});

// Get file metadata
const file = await driveSDK.getFile('fileId');

// Download a file
const content = await driveSDK.downloadFile('fileId');

// Create a file
const newFile = await driveSDK.createFile({
  name: 'New Document',
  mimeType: 'application/vnd.google-apps.document',
  parents: ['folderId'],
  description: 'This is a new document',
});

// Update a file
await driveSDK.updateFile('fileId', {
  name: 'Updated Name',
  description: 'Updated description',
  starred: true,
});

// Delete a file (move to trash)
await driveSDK.trashFile('fileId');

// Permanently delete a file
await driveSDK.deleteFile('fileId');
```

### Folder Operations

```typescript
// Create a folder
const folder = await driveSDK.createFolder('New Folder', 'parentFolderId');

// Move a file to a different folder
await driveSDK.moveFile('fileId', 'newParentFolderId', 'currentParentFolderId');

// Copy a file
await driveSDK.copyFile('fileId', {
  name: 'Copy of File',
  parents: ['destinationFolderId'],
});

// Create a shortcut to a file
await driveSDK.createShortcut(
  'targetFileId',
  'Shortcut Name',
  'parentFolderId',
);
```

### Search

```typescript
// Search for files with specific criteria
const results = await driveSDK.searchFiles(
  "name contains 'Report' and mimeType='application/pdf'",
);

// Search with additional options
const paginatedResults = await driveSDK.searchFiles(
  "modifiedTime > '2022-01-01'",
  {
    pageSize: 50,
    orderBy: 'modifiedTime desc',
  },
);
```

### Permissions

```typescript
// Get permissions for a file
const permissions = await driveSDK.getPermissions('fileId');

// Share a file with a user
await driveSDK.createPermission('fileId', {
  role: 'writer',
  type: 'user',
  emailAddress: 'user@example.com',
});

// Share a file with anyone (public link)
await driveSDK.createPermission('fileId', {
  role: 'reader',
  type: 'anyone',
});

// Update a permission
await driveSDK.updatePermission('fileId', 'permissionId', {
  role: 'commenter',
});

// Remove a permission
await driveSDK.deletePermission('fileId', 'permissionId');
```

### Comments and Revisions

```typescript
// Add a comment to a file
await driveSDK.createComment('fileId', 'This is a comment');

// List comments on a file
const comments = await driveSDK.listComments('fileId');

// Get revision history
const revisions = await driveSDK.listRevisions('fileId');

// Get a specific revision
const revision = await driveSDK.getRevision('fileId', 'revisionId');
```

### User Info

```typescript
// Get information about the user and storage quota
const aboutInfo = await driveSDK.getAbout('user,storageQuota,maxImportSizes');
```

## Authentication Notes

This SDK uses `@microfox/google` for token management, which provides:

1. Automatic token validation before API calls
2. Automatic token refresh when access tokens expire
3. Detailed token status information:
   - `valid` - The token is valid and ready to use
   - `expired` - The token has expired but may be refreshable
   - `invalid` - The token is invalid and cannot be used
4. Specific error messages from Google's authentication service

When using `createDriveSDKWithTokens`, a `DriveAuthError` will be thrown if authentication fails, containing detailed information about why the authentication failed.

## Error Handling

The Drive SDK provides error handling at two levels:

### Authentication Errors

```typescript
try {
  const driveSDK = await createDriveSDKWithTokens({
    driveAccessToken: 'possibly-invalid-token',
    driveRefreshToken: 'refresh-token',
  });

  // Use SDK...
} catch (error) {
  if (error instanceof DriveAuthError) {
    console.error(`Auth error: ${error.message}`);
    console.log(`Access token status: ${error.tokenInfo.accessTokenStatus}`);
    console.log(`Refresh token status: ${error.tokenInfo.refreshTokenStatus}`);

    // Handle different token issues
    if (
      error.tokenInfo.accessTokenStatus === 'expired' &&
      error.tokenInfo.refreshTokenStatus === 'invalid'
    ) {
      // Both tokens are problematic, require re-authentication
      redirectToLoginPage();
    } else if (
      error.tokenInfo.accessTokenStatus === 'invalid' &&
      !error.tokenInfo.refreshToken
    ) {
      // Invalid access token and no refresh token
      promptForNewToken();
    }
  }
}
```

### API Errors

```typescript
try {
  await driveSDK.createFile({
    name: 'New File',
    parents: ['possibly-invalid-folder-id'],
  });
} catch (error) {
  console.error(`API error: ${error.message}`);
}
```

## License

MIT
