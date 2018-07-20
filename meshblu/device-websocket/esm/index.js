import yargs from 'yargs';

import CloudDeviceFactory from './CloudDeviceFactory';

const { argv } = yargs
  .options({
    hostname: {
      description: 'Meshblu instance Websocker adapter host name',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    port: {
      description: 'Meshblu instance Websocket adapter port',
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
  })
  .wrap(120)
  .recommendCommands()
  .help()
  .strict();

const factory = new CloudDeviceFactory();
const device = factory.create(argv.hostname, argv.port, argv.uuid, argv.token);
device.start();
