import MeshbluWebsocket from 'meshblu-websocket';

import CloudDevice from './CloudDevice';

class CloudDeviceFactory {
  create(hostname, port, uuid, token) {
    const client = new MeshbluWebsocket({
      hostname,
      port,
      uuid,
      token,
    });
    return new CloudDevice(uuid, client);
  }
}

export default CloudDeviceFactory;
