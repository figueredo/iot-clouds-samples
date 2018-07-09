/* eslint-disable no-console */
import yargs from 'yargs';
import PubSub from '@google-cloud/pubsub';

const { argv } = yargs
  .options({
    projectId: {
      description: 'The project ID',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    telemetryTopic: {
      default: 'data',
      description: 'The telemetry topic to subscribe to',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    stateTopic: {
      default: 'state',
      description: 'The state topic to subscribe to',
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
  .wrap(120)
  .recommendCommands()
  .help()
  .strict();

function messageHandler(topic, message) {
  console.log(`Message received on '${topic}'`);
  console.log(`Id: ${message.id}`);
  console.log(`Data: ${message.data}`);
  message.ack();
}

const pubsub = new PubSub({
  projectId: argv.projectId,
  keyFilename: argv.serviceKeyFileName,
});
const telemetrySubscription = pubsub.subscription(argv.telemetryTopic);
telemetrySubscription.on('message', messageHandler.bind(null, argv.telemetryTopic));

const stateSubscription = pubsub.subscription(argv.stateTopic);
stateSubscription.on('message', messageHandler.bind(null, argv.stateTopic));

console.log('Waiting for messages');
