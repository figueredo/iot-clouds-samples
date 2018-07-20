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
    this.client.connect((err) => {
      if (err) {
        console.log(`${new Date().toString()} - failed to connect: ${err.message}`);
        return;
      }

      this.device.data$.subscribe(this.onDataRead.bind(this));
      this.device.state$.subscribe(this.onStateChanged.bind(this));
      this.device.start();

      this.client.on('config', this.onConfigArrived.bind(this));
    });
  }

  onDataRead(data) {
    this.client.message({ devices: '*', payload: { data } });
  }

  onStateChanged(state) {
    console.log(`${new Date().toString()} - state changed: ${util.inspect(state)}`);
    this.lastState = state;
    this.client.update({ uuid: this.uuid, state }, (err) => {
      if (err) {
        console.error(`${new Date().toString()} - failed to publish state changes: ${util.inspect(err)}`);
      }
    });
  }

  onConfigArrived(config) {
    if (!config.state || config.state.readIntervalMs === this.lastState.readIntervalMs) {
      return;
    }

    this.onConfigurationChanged(config.state);
  }

  onConfigurationChanged(configuration) {
    if (configuration.readIntervalMs) {
      this.device.changeReadInterval(configuration.readIntervalMs);
    }
  }
}

export default CloudDevice;
