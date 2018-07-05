import { Subject } from 'rxjs';

class Device {
  constructor() {
    this.readIntervalMs = 5000;
    this.dataSource = new Subject();
    this.stateSource = new Subject();
  }

  get data$() {
    return this.dataSource.asObservable();
  }

  get state$() {
    return this.stateSource.asObservable();
  }

  start() {
    this.lastStartAt = new Date();
    this.resetReadTimer();
    this.publishStateChange();
  }

  changeReadInterval(intervalMs) {
    if (!intervalMs || this.readIntervalMs === intervalMs) {
      return;
    }

    this.readIntervalMs = intervalMs;
    this.resetReadTimer();
    this.publishStateChange();
  }

  resetReadTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(this.read.bind(this), this.readIntervalMs);
  }

  publishStateChange() {
    this.stateSource.next({
      lastStartAt: this.lastStartAt.toUTCString(),
      readIntervalMs: this.readIntervalMs,
    });
  }

  read() {
    const value = this.getRandomInt();
    this.dataSource.next(value);
  }

  getRandomInt() {
    return Math.floor(Math.random() * Math.floor(100));
  }
}

export { Device }; // eslint-disable-line import/prefer-default-export
