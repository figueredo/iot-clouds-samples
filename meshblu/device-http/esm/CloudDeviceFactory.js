import MeshbluHttp from 'meshblu-http';

import CloudDevice from './CloudDevice';

class CloudDeviceFactory {
  create(hostname, port, uuid, token) {
    const client = new MeshbluHttp({
      hostname,
      port,
      uuid,
      token,
      protocol: 'http',
    });
    return new CloudDevice(uuid, client);
  }
}

export default CloudDeviceFactory;
