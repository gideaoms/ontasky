export function isError<T>(value: Error | T): value is Error {
  return value instanceof Error;
}
