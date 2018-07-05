/* eslint-disable no-console */
import util from 'util';
import mqtt from 'async-mqtt';

import { Device, TruncatedExponentialBackoff } from 'common';

class CloudDevice {
  constructor(mqttOptions, configTopic, stateTopic, telemetryTopic) {
    this.mqttOptions = mqttOptions;
    this.configTopic = configTopic;
    this.stateTopic = stateTopic;
    this.telemetryTopic = telemetryTopic;
    this.device = new Device();

    this.publishing = false;
    this.publishQueue = [];
  }

  start() {
    this.mqttClient = mqtt.connect(this.mqttOptions);

    this.device.data$.subscribe(this.onDataRead.bind(this));
    this.device.state$.subscribe(this.onStateChanged.bind(this));
    this.device.start();

    this.mqttClient.on('message', this.onMessageArrived.bind(this));
    this.mqttClient.on('close', async () => {
      console.error(`${new Date().toString()} - connection closed`);
      try {
        await this.mqttClient.unsubscribe(this.configTopic);
      } catch (e) {
        console.error(`${new Date().toString()} - failed to unsubscribe to config topic: ${util.inspect(e)}`);
      }
    });
    this.mqttClient.on('error', (err) => {
      console.error(`${new Date().toString()} - error: ${util.inspect(err)}`);
    });
    this.mqttClient.on('connect', async (connected) => {
      if (!connected) {
        console.error(`${new Date().toString()} - failed to connect to GC IoT`);
        return;
      }

      try {
        await this.mqttClient.subscribe(this.configTopic);
      } catch (e) {
        console.error(`${new Date().toString()} - failed to subscribe to config topic: ${util.inspect(e)}`);
      }
    });
  }

  onMessageArrived(topic, buffer) {
    const message = Buffer.from(buffer, 'base64').toString('ascii');
    if (!message) {
      return;
    }

    console.log(`${new Date().toString()} - message arrived at '${topic}': ${message}`);

    if (topic === this.configTopic) {
      const configuration = JSON.parse(message);
      this.onConfigurationChanged(configuration);
    }
  }

  onDataRead(data) {
    const cloudData = JSON.stringify(data);
    console.log(`${new Date().toString()} - data read: ${cloudData}`);
    this.publish(this.telemetryTopic, cloudData)
      .catch((err) => {
        console.error(`${new Date().toString()} - failed to publish new data: ${util.inspect(err)}`);
      });
  }

  onStateChanged(state) {
    const cloudState = JSON.stringify(state);
    console.log(`${new Date().toString()} - state changed: ${cloudState}`);
    this.publish(this.stateTopic, cloudState)
      .catch((err) => {
        console.error(`${new Date().toString()} - failed to publish state changes: ${util.inspect(err)}`);
      });
  }

  onConfigurationChanged(configuration) {
    if (configuration.readIntervalMs) {
      this.device.changeReadInterval(configuration.readIntervalMs);
    }
  }

  async publish(topic, message) {
    this.publishQueue.push({ topic, message });

    if (this.publishing) {
      console.log(`${new Date().toString()} - enqueuing '${message}' for '${topic}'`);
      return;
    }

    this.publishing = true;
    while (this.publishQueue.length > 0) {
      const next = this.publishQueue.shift();
      await this.doPublish(next.topic, next.message); // eslint-disable-line no-await-in-loop
    }
    this.publishing = false;
  }

  async doPublish(topic, message) {
    const backoffPublisher = new TruncatedExponentialBackoff(
      this.mqttClient.publish.bind(this.mqttClient, topic, message, { qos: 1 }),
    );
    await backoffPublisher.execute();
  }
}

export default CloudDevice;
