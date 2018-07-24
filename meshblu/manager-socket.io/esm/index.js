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
  })
  .command(
    'register',
    'Register a device.',
    {},
    (args) => {
      const manager = new MeshbluSocketIO({
        hostname: args.hostname,
        port: args.port,
        protocol: 'ws',
      });

      manager.on('ready', () => {
        manager.register({}, (device) => {
          console.log('Device registered');
          console.log(`UUID: ${device.uuid}`);
          console.log(`Token: ${device.token}`);
          manager.close();
        });
      });
      manager.connect();
    },
  )
  .command(
    'unregister <uuid>',
    'Unregister a device.',
    {},
    (args) => {
      const manager = new MeshbluSocketIO({
        hostname: args.hostname,
        port: args.port,
        protocol: 'ws',
      });

      manager.on('ready', () => {
        manager.unregister({ uuid: args.uuid }, (result) => {
          if (result.error) {
            console.error(`Failed to unregister the device: ${result.error}`);
          } else {
            console.log('Device unregistered');
          }
          manager.close();
        });
      });
      manager.connect();
    },
  )
  .wrap(120)
  .demandCommand()
  .help()
  .strict()
  .argv;
