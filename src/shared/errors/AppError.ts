
class AppError extends Error {
    public readonly errorCode: number;
  
    constructor(messsage: string, errorCode = 400) {
      super(messsage)
      this.errorCode = errorCode;
    };
}

export { AppError }