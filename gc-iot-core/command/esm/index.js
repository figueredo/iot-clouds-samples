/* eslint-disable no-console */
import fs from 'fs';
import yargs from 'yargs';
import { google } from 'googleapis';

const API_VERSION = 'v1';
const DISCOVERY_API = 'https://cloudiot.googleapis.com/$discovery/rest';

// The next two functions (getClient and setDeviceConfig) were copied from
// https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/iot/manager/manager.js
// and promisified.

// Returns an authorized API client by discovering the Cloud IoT Core API with
// the provided API key.
async function getClient(serviceAccountJson) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountJson));
  const jwtAccess = new google.auth.JWT();
  jwtAccess.fromJSON(serviceAccount);
  // Note that if you require additional scopes, they should be specified as a
  // string, separated by spaces.
  jwtAccess.scopes = 'https://www.googleapis.com/auth/cloud-platform';
  // Set the default authentication to the above JWT access.
  google.options({ auth: jwtAccess });

  const discoveryUrl = `${DISCOVERY_API}?version=${API_VERSION}`;

  return google.discoverAPI(discoveryUrl, {});
}

// Send configuration data to device.
async function setDeviceConfig(
  client,
  deviceId,
  registryId,
  projectId,
  cloudRegion,
  data,
  version,
) {
  // [START iot_set_device_config]
  // Client retrieved in callback
  // getClient(serviceAccountJson, function(client) {...});
  // const cloudRegion = 'us-central1';
  // const deviceId = 'my-device';
  // const projectId = 'adjective-noun-123';
  // const registryId = 'my-registry';
  // const data = 'test-data';
  // const version = 0;
  const parentName = `projects/${projectId}/locations/${cloudRegion}`;
  const registryName = `${parentName}/registries/${registryId}`;

  const binaryData = Buffer.from(data).toString('base64');
  const request = {
    name: `${registryName}/devices/${deviceId}`,
    versionToUpdate: version,
    binaryData,
  };

  await client.projects.locations.registries.devices.modifyCloudToDeviceConfig(request);
  // [END iot_set_device_config]
}

yargs
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
    serviceKeyFileName: {
      description: 'Path to service key file',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
  })
  .command(
    'changeReadInterval <readIntervalMs>',
    'Changes the interval the device reads from its sensor.',
    {},
    async (args) => {
      try {
        const client = await getClient(args.serviceKeyFileName);
        await setDeviceConfig(
          client,
          args.deviceId,
          args.registryId,
          args.projectId,
          args.region,
          JSON.stringify({ readIntervalMs: args.readIntervalMs }),
          0,
        );
      } catch (err) {
        console.error('Error while changing the read interval', err);
      }
    },
  )
  .wrap(120)
  .demandCommand()
  .help()
  .strict();
