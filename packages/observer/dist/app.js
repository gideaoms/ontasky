export class Observer {
    constructor() {
        this.subscribers = new Set();
    }
    subscribe(fn) {
        this.subscribers.add(fn);
    }
    notify(value) {
        this.subscribers.forEach((fn) => fn(value));
    }
}
//# sourceMappingURL=app.js.map