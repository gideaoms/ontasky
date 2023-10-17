export declare class Observer<T> {
    private readonly subscribers;
    subscribe(fn: (value: T) => void): void;
    notify(value: T): void;
}
//# sourceMappingURL=app.d.ts.map