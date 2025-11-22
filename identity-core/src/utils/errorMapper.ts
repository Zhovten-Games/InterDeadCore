export class IdentityCoreError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
  }
}

export const mapError = (error: unknown, fallbackMessage: string): IdentityCoreError => {
  if (error instanceof IdentityCoreError) {
    return error;
  }
  if (error instanceof Error) {
    return new IdentityCoreError(`${fallbackMessage}: ${error.message}`, error);
  }
  return new IdentityCoreError(fallbackMessage, error);
};
