import { formatTime } from './helpers';

export class Stopwatch {
  private countup = 0; // holds the setInterval
  private timeElapsed: number; // holds the current elapsed time
  private eventCallbacks: { [key: string]: Array<() => void> } = {}; // <-- Define an event callbacks object

  constructor(private startTime: number, private timeElement: HTMLElement) {
    this.timeElapsed = this.startTime;
    this.timeElement.textContent = formatTime(this.timeElapsed); // update timer display
  }

  on(eventName: string, callback: () => void) {
    // <-- Provide method to register callbacks
    if (!this.eventCallbacks[eventName]) {
      this.eventCallbacks[eventName] = [];
    }
    this.eventCallbacks[eventName].push(callback);
  }

  private emit(eventName: string) {
    // <-- Call all registered callbacks when the event happens
    if (this.eventCallbacks[eventName]) {
      this.eventCallbacks[eventName].forEach((callback) => callback());
    }
  }

  start() {
    const startTime = performance.now();
    let previousTime = startTime;

    const update = () => {
      const currentTime = performance.now();
      const elapsed = (currentTime - startTime) / 1000; // convert to seconds
      this.timeElapsed = this.startTime + elapsed;

      if (this.timeElement) {
        this.timeElement.textContent = formatTime(this.timeElapsed); // update timer display
      }

      previousTime = currentTime;
      this.countup = requestAnimationFrame(update);
    };

    this.countup = requestAnimationFrame(update);
  }

  stop() {
    clearInterval(this.countup); // stop the countup
  }

  reset() {
    this.stop();
    this.timeElapsed = this.startTime; // reset time elapsed to the initial start time
    this.timeElement.textContent = formatTime(this.timeElapsed); // update timer display
  }

  getTime(): number {
    const secondsAccurate = this.timeElapsed + (performance.now() % 1000) / 1000;
    return Number(secondsAccurate.toFixed(2));
  }

  getAccurateTime() {
    const secondsAccurate = this.timeElapsed + (performance.now() % 1000) / 1000;
    return secondsAccurate.toFixed(2);
  }
}
