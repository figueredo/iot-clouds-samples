/* eslint-disable no-console */
import yargs from 'yargs';
import MeshbluSocketIO from 'meshblu';

const { argv } = yargs
  .options({
    hostname: {
      description: 'Meshblu instance Socket.io adapter host name',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    port: {
      description: 'Meshblu instance Socket.io adapter port',
      requiresArg: true,
      demandOption: true,
      type: 'number',
    },
    uuid: {
      description: 'The consumer UUID',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    token: {
      description: 'The consumer token',
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

const consumer = new MeshbluSocketIO({
  hostname: argv.hostname,
  port: argv.port,
  uuid: argv.uuid,
  token: argv.token,
  protocol: 'ws',
});

consumer.on('ready', () => {
  console.log(`${new Date().toString()} - authenticated`);
});
consumer.on('notReady', () => {
  console.log(`${new Date().toString()} - authentication failed`);
});
consumer.on('message', (message) => {
  console.log(`${new Date().toString()} - message received: ${JSON.stringify(message.payload)}`);
});
consumer.on('config', (config) => {
  console.log(`${new Date().toString()} - configuration changed: ${JSON.stringify(config)}`);
});
consumer.connect();
consumer.subscribe({ uuid: argv.fromUuid });
