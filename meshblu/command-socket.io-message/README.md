# Application that manages device configuration

This application sends commands as messages to a [device](../../common) using the Socket.io adapter.

## Quickstart

1. Follow the instructions provided in this [README.md](../README.md) to create the cloud.
1. Follow the instructions provided in this [device's README.md](../device-socket.io-message) to create the device that receives the command. Differently than [the other command application](../command-socket.io), this will **ONLY** work with this particular device implementation.
1. Create a device that will send the command (save the output): `curl -X POST http://localhost:3000/devices`
1. Install the dependencies: `npm i`
1. Build: `npm run build`
1. Start the appilcation

```
npm start --
    --hostname=localhost
    --port=3001
    --uuid=<sender UUID>
    --token=<sender token>
    --toUuid=<receiver UUID>
```

Mind that these device properties are generated in the second and third step.
