export function isError<T>(value: Error | T): value is Error {
  return value instanceof Error;
}

export function invariant(value: unknown): asserts value {
  if (!value) {
    throw new Error("Value is falsy");
  }
}
