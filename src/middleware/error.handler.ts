class ErrorHandler extends Error {
  code: number;
  constructor(message: string, errorCode: number) {
    super(message);
    this.message = message;
    this.code = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default ErrorHandler;
