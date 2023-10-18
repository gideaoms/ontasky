export class Error extends global.Error {
  public readonly status = 404;

  constructor(message: string) {
    super(message);
  }
}
