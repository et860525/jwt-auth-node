export default class DefaultError extends Error {
  status!: string;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}
