/* eslint-disable no-console */
import yargs from 'yargs';
import MeshbluSocketIO from 'meshblu';

yargs // eslint-disable-line no-unused-expressions
  .options({
    hostname: {
      description: 'Meshblu instance Socket.io adapter host name',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    port: {
      description: 'Meshblu instance Socket.io port',
      requiresArg: true,
      demandOption: true,
      type: 'number',
    },
    uuid: {
      description: 'The sender UUID',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    token: {
      description: 'The sender token',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    toUuid: {
      description: 'The receiver UUID',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
  })
  .command(
    'changeReadInterval <readIntervalMs>',
    'Changes the interval the device reads from its sensor.',
    {},
    (args) => {
      const sender = new MeshbluSocketIO({
        hostname: args.hostname,
        port: args.port,
        uuid: args.uuid,
        token: args.token,
        protocol: 'ws',
      });

      sender.on('ready', () => {
        sender.update({ uuid: args.toUuid, state: { readIntervalMs: args.readIntervalMs } }, () => {
          sender.close();
        });
      });
      sender.on('notReady', () => {
        console.log('Authentication failed');
        sender.close();
      });
      sender.connect();
    },
  )
  .wrap(120)
  .demandCommand()
  .help()
  .strict()
  .argv;
