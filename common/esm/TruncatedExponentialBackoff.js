/* eslint-disable no-console */
import util from 'util';

const setTimeoutAsync = util.promisify(setTimeout);

const MINIMUM_BACKOFF_TIME_SEC = 1;
const MAXIMUM_BACKOFF_TIME_SEC = 32;

class TruncatedExponentialBackoff {
  constructor(publishAsync, minimumBackOffTimeSec, maximumBackOffTimeSec) {
    this.publishAsync = publishAsync;
    this.backOffTimeSec = minimumBackOffTimeSec || MINIMUM_BACKOFF_TIME_SEC;
    this.maximumBackOffTimeSec = maximumBackOffTimeSec || MAXIMUM_BACKOFF_TIME_SEC;
  }

  async execute() {
    try {
      await this.publishAsync();
    } catch (e) {
      const delayMs = 1000 * (this.backOffTimeSec + Math.random());
      if (this.backOffTimeSec < MAXIMUM_BACKOFF_TIME_SEC) {
        this.backOffTimeSec *= 2;
      }
      console.log(`${new Date().toString()} - backing off for ${delayMs}ms`);
      await setTimeoutAsync(delayMs);
      await this.execute();
    }
  }
}

export { TruncatedExponentialBackoff }; // eslint-disable-line import/prefer-default-export
