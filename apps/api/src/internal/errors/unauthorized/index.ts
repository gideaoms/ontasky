export class Error extends global.Error {
  public readonly status = 401;

  constructor() {
    super("Unauthorized");
  }
}
