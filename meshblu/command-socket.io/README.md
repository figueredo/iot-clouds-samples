# Application that manages device configuration

This application sends commands to a [device](../../common) using the Socket.io adapter.

## Quickstart

1. Follow the instructions provided in this [README.md](../README.md) to create the cloud.
1. Follow the instructions provided in one of the devices' README.md to create the device that receives the command.
1. Create a device that will send the command (save the output): `curl -X POST http://localhost:3000/devices`
1. Install the dependencies: `npm i`
1. Build: `npm run build`
1. Start the application

```
npm start --
    --hostname=localhost
    --port=3001
    --uuid=<sender UUID>
    --token=<sender token>
    --toUuid=<receiver UUID>
```

Mind that these device properties are generated in the second and third step.
