import yargs from 'yargs';

import CloudDeviceFactory from './CloudDeviceFactory';

const { argv } = yargs
  .options({
    region: {
      default: 'us-central1',
      description: 'GCP cloud region',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    projectId: {
      description: 'The project ID',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    registryId: {
      description: 'The registry ID',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    deviceId: {
      description: 'The device ID',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    privateKeyFileName: {
      description: 'Path to private key file',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    algorithm: {
      description: 'Encryption algorithm to generate the JWT',
      requiresArg: true,
      demandOption: true,
      choices: ['RS256', 'ES256'],
      type: 'string',
    },
  })
  .wrap(120)
  .recommendCommands()
  .help()
  .strict();

const factory = new CloudDeviceFactory();
const device = factory.create(argv.region, argv.projectId, argv.registryId, argv.deviceId,
  argv.privateKeyFileName, argv.algorithm);
device.start();
