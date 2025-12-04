export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public name: string = "AppError"
  ) {
    super(message);
  }
}
