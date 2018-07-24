/* eslint-disable no-console */
import util from 'util';
import yargs from 'yargs';
import MeshbluFirehoseSocketIO from 'meshblu-firehose-socket.io';
import MeshbluHttp from 'meshblu-http';

const { argv } = yargs
  .options({
    httpHostname: {
      description: 'Meshblu instance HTTP adapter host name',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    httpPort: {
      description: 'Meshblu instance HTTP adapter port',
      requiresArg: true,
      demandOption: true,
      type: 'number',
    },
    firehoseHostname: {
      description: 'Meshblu instance firehose host name',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    firehosePort: {
      description: 'Meshblu instance firehose port',
      requiresArg: true,
      demandOption: true,
      type: 'number',
    },
    uuid: {
      description: 'The device UUID',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    token: {
      description: 'The device token',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    fromUuid: {
      description: 'The UUID of the device sending messages',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
  })
  .wrap(120)
  .recommendCommands()
  .help()
  .strict();

const subscriber = new MeshbluHttp({
  hostname: argv.httpHostname,
  port: argv.httpPort,
  uuid: argv.uuid,
  token: argv.token,
  protocol: 'http',
});
subscriber.createSubscription({
  subscriberUuid: argv.uuid,
  emitterUuid: argv.uuid,
  type: 'broadcast.received',
}, (err) => {
  if (err) {
    console.error(`${new Date().toString()} - failed to subscribe to received broadcast messages: ${util.inspect(err)}`);
    return;
  }

  subscriber.createSubscription({
    subscriberUuid: argv.uuid,
    emitterUuid: argv.fromUuid,
    type: 'broadcast.sent',
  }, (err) => { // eslint-disable-line no-shadow
    if (err) {
      console.error(`${new Date().toString()} - failed to subscribe to sent broadcast messages: ${util.inspect(err)}`);
      return;
    }

    const firehose = new MeshbluFirehoseSocketIO({
      meshbluConfig: {
        hostname: argv.firehoseHostname,
        port: argv.firehosePort,
        protocol: 'ws',
        uuid: argv.uuid,
        token: argv.token,
      },
    });
    firehose.on('message', (message) => {
      console.log(`${new Date().toString()} - message received - ${message.metadata.responseId}`);
      console.log(`${new Date().toString()} - route: ${util.inspect(message.metadata)}`);
      console.log(`${new Date().toString()} - data: ${util.inspect(message.data.payload)}`);
    });
    firehose.connect();
    console.log(`${new Date().toString()} - waiting for messages`);
  });
});
