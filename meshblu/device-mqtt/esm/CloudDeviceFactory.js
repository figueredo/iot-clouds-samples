import MeshbluMqtt from 'meshblu-mqtt';

import CloudDevice from './CloudDevice';

class CloudDeviceFactory {
  create(hostname, port, uuid, token) {
    const client = new MeshbluMqtt({
      hostname,
      port,
      uuid,
      token,
    });
    return new CloudDevice(uuid, client);
  }
}

export default CloudDeviceFactory;
