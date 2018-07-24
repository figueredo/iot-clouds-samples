# Device manager

This application creates and deletes Meshblu devices using the Socket.io adapter. It is creating the default open devices, i.e. that can be changed by any device. See the [documentation](https://github.com/octoblu/node-meshblu-socket.io#meshbluregisterparams-callback) for more information.

## Quickstart

1. Follow the instructions provided in this [README.md](../README.md) to create the cloud.
1. Install the dependencies: `npm i`
1. Build: `npm run build`
1. Start the device manager

```
npm start --
    --hostname=localhost
    --port=3001
    <command>
```

See `npm start -- --help` for available commands.
