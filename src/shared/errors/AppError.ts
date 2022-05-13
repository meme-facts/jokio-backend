class AppError extends Error {
  public readonly errorCode: number;

  constructor(message: string, errorCode = 400) {
    super(message);
    this.errorCode = errorCode;
  }
}

export { AppError };
