class Emitter {
  events: any;

  constructor() {
    this.events = {};
  }

  emit(e: any, ...args: any) {
    if (this.events[e]) {
      this.events[e].forEach((fn: any) => fn(...args));
    }
    return this;
  }

  on(e: any, fn: any) {
    this.events[e] ? this.events[e].push(fn) : (this.events[e] = [fn]);
    return this;
  }

  off(e: any, fn: any) {
    if (e && typeof fn === 'function') {
      const listeners = this.events[e];
      listeners.splice(
        listeners.findIndex((_fn: any) => _fn === fn),
        1,
      );
    } else {
      this.events[e] = [];
    }
    return this;
  }
}

export default Emitter;
