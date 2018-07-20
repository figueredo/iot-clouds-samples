/* eslint-disable no-console */
import util from 'util';

import { Device } from 'common';

class CloudDevice {
  constructor(uuid, client) {
    this.uuid = uuid;
    this.client = client;
    this.device = new Device();
    this.lastState = { readIntervalMs: undefined };
  }

  start() {
    this.device.data$.subscribe(this.onDataRead.bind(this));
    this.device.state$.subscribe(this.onStateChanged.bind(this));
    this.device.start();

    this.pollConfig();
  }

  onDataRead(data) {
    this.client.message({ devices: '*', payload: { data } }, (err) => {
      if (err) {
        console.error(`${new Date().toString()} - failed to publish new data: ${util.inspect(err)}`);
      }
    });
  }

  onStateChanged(state) {
    console.log(`${new Date().toString()} - state changed: ${util.inspect(state)}`);
    this.lastState = state;
    this.client.update(this.uuid, { state }, (err) => {
      if (err) {
        console.error(`${new Date().toString()} - failed to publish state changes: ${util.inspect(err)}`);
      }
    });
  }

  pollConfig() {
    setInterval(this.getConfig.bind(this), 2000);
  }

  getConfig() {
    this.client.device(this.uuid, (err, response) => {
      if (err) {
        console.error(`${new Date().toString()} - failed to get configuration changes: ${util.inspect(err)}`);
        return;
      }

      if (!response.state || response.state.readIntervalMs === this.lastState.readIntervalMs) {
        return;
      }

      this.onConfigurationChanged(response.state);
    });
  }

  onConfigurationChanged(configuration) {
    if (configuration.readIntervalMs) {
      this.device.changeReadInterval(configuration.readIntervalMs);
    }
  }
}

export default CloudDevice;
