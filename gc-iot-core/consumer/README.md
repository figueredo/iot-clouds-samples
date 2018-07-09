# Application that consumes device data and state

This application subscribes to the topics to which the [device](../../common) publishes to.

## Quickstart

1. Follow the instructions provided in this [README.md](../README.md) to create the cloud, registry and device.
1. Install the dependencies: `npm i`
1. Build: `npm run build`
1. Start the consumer

```
npm start --
    --projectId=<project ID>
    --telemetryTopic=<telemetry topic>
    --stateTopic=<state topic>
    --serviceKeyFileName=<path/to/serviceKey>
```

Mind that these IDs and the key are generated in the first step and that this key is a service account key.
