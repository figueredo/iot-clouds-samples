# Application that manages device configuration

This application sends commands to a [device](../../common).

## Quickstart

1. Follow the instructions provided in this [README.md](../README.md) to create the cloud, registry and device.
1. Install the dependencies: `npm i`
1. Build: `npm run build`
1. Start the manager

```
npm start --
    --projectId=<project ID>
    --registryId=<registry ID>
    --deviceId=<device ID>
    --serviceKeyFileName=<path/to/serviceKey>
    changeReadInterval <read intervalinterval in ms>
```

Mind that these IDs and the key are generated in the first step and that this key is a service account key.
