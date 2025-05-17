export enum PinterestErrorCode {
  INVALID_TOKEN = 1001,
  TOKEN_EXPIRED = 1002,
  RATE_LIMIT_EXCEEDED = 1003,
  RESOURCE_NOT_FOUND = 1004,
  INVALID_PARAMETER = 1005,
  PERMISSION_DENIED = 1006,
  VALIDATION_ERROR = 1007,
  API_ERROR = 1008,
}

export class PinterestError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: PinterestErrorCode,
    public details?: any,
  ) {
    super(message);
    this.name = 'PinterestError';
  }

  isAuthenticationError(): boolean {
    return (
      this.code === PinterestErrorCode.INVALID_TOKEN ||
      this.code === PinterestErrorCode.TOKEN_EXPIRED
    );
  }

  isRateLimitError(): boolean {
    return this.code === PinterestErrorCode.RATE_LIMIT_EXCEEDED;
  }

  isNotFoundError(): boolean {
    return this.code === PinterestErrorCode.RESOURCE_NOT_FOUND;
  }

  isValidationError(): boolean {
    return this.code === PinterestErrorCode.VALIDATION_ERROR;
  }

  isPermissionError(): boolean {
    return this.code === PinterestErrorCode.PERMISSION_DENIED;
  }
}
