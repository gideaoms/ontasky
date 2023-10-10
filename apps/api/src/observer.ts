export class Observer<T> {
  private readonly subscribers = new Set<(value: T) => void>();

  subscribe(fn: (value: T) => void) {
    this.subscribers.add(fn);
  }

  notify(value: T) {
    this.subscribers.forEach((fn) => fn(value));
  }
}
