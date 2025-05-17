# Pinterest SDK Documentation

Welcome to the Pinterest SDK documentation! This SDK provides a TypeScript interface for the Pinterest API v5.

## Table of Contents

1. [Getting Started](./getting-started.md)

   - Installation
   - Configuration
   - Basic Usage

2. [Authentication](./authentication.md)

   - Access Tokens
   - OAuth Flow
   - Scopes

3. [API Reference](./api-reference.md)

   - User Endpoints
   - Board Endpoints
   - Pin Endpoints
   - Search Endpoints

4. [Examples](./examples.md)

   - Basic Usage
   - Board Management
   - Pin Management
   - User Profile

5. [Error Handling](./error-handling.md)

   - Error Types
   - Error Handling Best Practices
   - Rate Limiting

6. [Best Practices](./best-practices.md)

   - Performance Optimization
   - Security Considerations
   - Rate Limiting

7. [Migration Guide](./migration.md)

   - Upgrading from Previous Versions
   - Breaking Changes

8. [Contributing](./contributing.md)
   - Development Setup
   - Code Style
   - Testing
   - Pull Requests

## Quick Start

```typescript
import PinterestClient from '@microfox/pinterest';

const pinterest = new PinterestClient({
  accessToken: 'YOUR_ACCESS_TOKEN',
});

// Get current user
const user = await pinterest.getCurrentUser();
console.log(user);
```

## Features

- Full TypeScript support
- Comprehensive error handling
- Zod schema validation
- Support for Pinterest API v5
- Promise-based API
- Automatic rate limiting
- OAuth support

## Support

- [GitHub Issues](https://github.com/microfox-ai/microfox/issues)
- [Documentation](https://github.com/microfox-ai/microfox/tree/main/packages/pinterest/docs)
- [Examples](https://github.com/microfox-ai/microfox/tree/main/packages/pinterest/examples)

## License

MIT
