/* eslint-disable no-console */
import util from 'util';
import request from 'request-promise-native';

import { Device, TruncatedExponentialBackoff } from 'common';

class CloudDevice {
  constructor(baseUri, httpOptions, configPath, statePath, telemetryPath) {
    this.baseUri = baseUri;
    this.httpOptions = httpOptions;
    this.configPath = configPath;
    this.statePath = statePath;
    this.telemetryPath = telemetryPath;
    this.device = new Device();

    this.configVersion = 0;

    this.publishing = false;
    this.publishQueue = [];
  }

  start() {
    this.device.data$.subscribe(this.onDataRead.bind(this));
    this.device.state$.subscribe(this.onStateChanged.bind(this));
    this.device.start();

    this.pollConfig();
  }

  onDataRead(data) {
    const cloudData = JSON.stringify(data);
    console.log(`${new Date().toString()} - data read: ${cloudData}`);
    this.publish(this.telemetryPath, cloudData)
      .catch((err) => {
        console.error(`${new Date().toString()} - failed to publish new data: ${util.inspect(err)}`);
      });
  }

  onStateChanged(state) {
    const cloudState = JSON.stringify(state);
    console.log(`${new Date().toString()} - state changed: ${cloudState}`);
    this.publish(this.statePath, cloudState)
      .catch((err) => {
        console.error(`${new Date().toString()} - failed to publish state changes: ${util.inspect(err)}`);
      });
  }

  pollConfig() {
    setInterval(this.getConfig.bind(this), 2000);
  }

  getConfig() {
    const uri = `${this.getUri(this.configPath)}?local_version=${this.configVersion}`;
    const options = { uri, method: 'GET', ...this.httpOptions };
    request(options)
      .then((response) => {
        if (response.version === this.configVersion) {
          return;
        }
        this.configVersion = response.version;
        try {
          const configuration = JSON.parse(Buffer.from(response.binaryData, 'base64').toString());
          this.onConfigurationChanged(configuration);
        } catch (e) {
          console.error(`${new Date().toString()} - failed to parse configuration from response: ${util.inspect(response)}`);
        }
      })
      .catch((err) => {
        console.error(`${new Date().toString()} - failed to get configuration: ${util.inspect(err)}`);
      });
  }

  onConfigurationChanged(configuration) {
    if (configuration.readIntervalMs) {
      this.device.changeReadInterval(configuration.readIntervalMs);
    }
  }

  async publish(path, message) {
    this.publishQueue.push({ path, message });

    if (this.publishing) {
      console.log(`${new Date().toString()} - enqueuing '${message}' for '${path}'`);
      return;
    }

    this.publishing = true;
    while (this.publishQueue.length > 0) {
      const next = this.publishQueue.shift();
      await this.doPublish(next.path, next.message); // eslint-disable-line no-await-in-loop
    }
    this.publishing = false;
  }

  async doPublish(path, message) {
    const uri = this.getUri(path);
    const body = this.getBody(path, message);
    const options = {
      uri,
      method: 'POST',
      body,
      ...this.httpOptions,
    };
    const backoffPublisher = new TruncatedExponentialBackoff(
      request.bind(null, options),
    );
    await backoffPublisher.execute();
  }

  getUri(path) {
    return `${this.baseUri}${path}`;
  }

  getBody(path, message) {
    const binary_data = Buffer.from(message).toString('base64'); // eslint-disable-line camelcase
    return path === this.telemetryPath ? { binary_data } : { state: { binary_data } };
  }
}

export default CloudDevice;
