/**
 * Custom error classes for Nomba API interactions.
 * Used by both mock and live providers.
 */

export class NombaApiError extends Error {
  public readonly statusCode: number;
  public readonly nombaCode: string;
  public readonly nombaDescription: string;

  constructor(statusCode: number, description: string, nombaCode: string = 'ERR') {
    super(`Nomba API Error (${statusCode}): ${description}`);
    this.name = 'NombaApiError';
    this.statusCode = statusCode;
    this.nombaCode = nombaCode;
    this.nombaDescription = description;
  }
}

export class NombaTimeoutError extends Error {
  constructor(endpoint: string, timeoutMs: number) {
    super(`Nomba API timeout after ${timeoutMs}ms calling ${endpoint}`);
    this.name = 'NombaTimeoutError';
  }
}

export class NombaRateLimitError extends NombaApiError {
  public readonly retryAfterSeconds: number;

  constructor(retryAfter: number = 60) {
    super(429, `Rate limit exceeded. Retry after ${retryAfter}s`, '429');
    this.name = 'NombaRateLimitError';
    this.retryAfterSeconds = retryAfter;
  }
}

export class NombaSignatureError extends Error {
  constructor() {
    super('Webhook signature verification failed');
    this.name = 'NombaSignatureError';
  }
}
