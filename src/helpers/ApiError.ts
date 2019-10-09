export default class ApiError extends Error {
  private code: number;

  constructor(message: string, code: number) {
    super(message);

    Error.captureStackTrace(this, ApiError);

    this.code = code;
  }

  get responseData() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}
