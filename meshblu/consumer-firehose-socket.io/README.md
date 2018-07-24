# Application that consumes device data and state

This application subscribes to the messages the [device](../../common) sends using the firehose.

## Quickstart

1. Follow the instructions provided in this [README.md](../README.md) to create the cloud.
1. Follow the instructions provided in one of the devices' README.md to create the producer.
1. Create a device that will receive the messages (save the output): `curl -X POST http://localhost:3000/devices`
1. Install the dependencies: `npm i`
1. Build: `npm run build`
1. Start the consumer

```
npm start --
    --httpHostname=localhost
    --httpPort=3000
    --firehoseHostname=localhost
    --firehosePort=3080
    --uuid=<consumer UUID>
    --token=<consumer token>
    --fromUuid=<producer UUID>
```

Mind that these device properties are generated in the second and third step.
