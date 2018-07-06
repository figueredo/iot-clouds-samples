# Device using the HTTP bridge

This is the implementation of the [device](../../common) using the Google Cloud IoT Core HTTP bridge.

## Quickstart

1. Follow the instructions provided in this [README.md](../README.md) to create the cloud, registry and device.
1. Install the dependencies: `npm i`
1. Build: `npm run build`
1. Start the device:

```
npm start --
    --projectId=<project ID>
    --registryId=<registry ID>
    --deviceId=<device ID>
    --privateKeyFileName=<path/to/privateKey>
    --algorithm=<private key algorithm>
```

Mind that these IDs and the private key are generated in the first step.