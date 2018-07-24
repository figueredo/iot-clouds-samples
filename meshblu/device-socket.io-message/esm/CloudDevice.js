/* eslint-disable no-console */
import util from 'util';

import { Device } from 'common';

class CloudDevice {
  constructor(uuid, client) {
    this.uuid = uuid;
    this.client = client;
    this.device = new Device();
    this.initialized = false;
    this.lastState = { readIntervalMs: undefined };
  }

  start() {
    this.device.data$.subscribe(this.onDataRead.bind(this));
    this.device.state$.subscribe(this.onStateChanged.bind(this));
    this.client.on('message', this.onMessageArrived.bind(this));
    this.client.on('ready', () => {
      console.log(`${new Date().toString()} - authenticated`);

      if (!this.initialized) {
        this.initialized = true;
        this.device.start();
      }
    });
    this.client.on('notReady', () => {
      console.log(`${new Date().toString()} - authentication failed`);
    });
    this.client.connect();
    this.client.subscribe({ uuid: this.uuid });
  }

  onDataRead(data) {
    this.client.message({ devices: '*', payload: { data } });
  }

  onStateChanged(state) {
    console.log(`${new Date().toString()} - state changed: ${util.inspect(state)}`);
    this.lastState = state;
    this.client.update({ uuid: this.uuid, state });
  }

  onMessageArrived(message) {
    console.log(`${new Date().toString()} - message arrived: ${util.inspect(message)}`);
    const { payload, topic } = message;
    if (topic !== 'change-read-interval'
      || !payload || payload.readIntervalMs === this.lastState.readIntervalMs) {
      return;
    }

    this.changeReadInterval(payload.readIntervalMs);
  }

  changeReadInterval(readIntervalMs) {
    this.device.changeReadInterval(readIntervalMs);
  }
}

export default CloudDevice;
