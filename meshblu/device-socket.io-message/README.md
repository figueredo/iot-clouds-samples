# Device using the Socket.io adapter

This is the implementation of the [device](../../common) using the Meshblu Socket.io protocol adapter that receives commands through messages.

## Quickstart

1. Follow the instructions provided in this [README.md](../README.md) to create the cloud.
1. Create a device (save the output): `curl -X POST http://localhost:3000/devices`
1. Install the dependencies: `npm i`
1. Build: `npm run build`
1. Start the device:

```
npm start --
    --hostname=localhost
    --port=3001
    --uuid=<device UUID>
    --token=<device token>
```

Mind that these device properties are generated in the second step.
