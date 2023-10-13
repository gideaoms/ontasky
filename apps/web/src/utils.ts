export function isError<T>(value: Error | T): value is Error {
  return value instanceof Error;
}

export function isOkStatus(status: number) {
  return status >= 200 && status <= 299;
}
