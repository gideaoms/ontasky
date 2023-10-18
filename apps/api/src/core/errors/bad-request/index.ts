export class Error extends global.Error {
  public readonly status = 422;

  constructor(message: string) {
    super(message);
  }
}
