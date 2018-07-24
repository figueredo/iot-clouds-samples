import MeshbluSocketIO from 'meshblu';

import CloudDevice from './CloudDevice';

class CloudDeviceFactory {
  create(hostname, port, uuid, token) {
    const client = new MeshbluSocketIO({
      hostname,
      port,
      uuid,
      token,
      protocol: 'ws',
    });
    return new CloudDevice(uuid, client);
  }
}

export default CloudDeviceFactory;
