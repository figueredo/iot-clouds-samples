import fs from 'fs';
import jwt from 'jsonwebtoken';

import CloudDevice from './CloudDevice';

class CloudDeviceFactory {
  create(region, projectId, registryId, deviceId, privateKeyFileName, algorithm) {
    const configTopic = `/devices/${deviceId}/config`;
    const stateTopic = `/devices/${deviceId}/state`;
    const telemetryTopic = `/devices/${deviceId}/events`;
    const mqttClientId = `projects/${projectId}/locations/${region}/registries/${registryId}/devices/${deviceId}`;
    const options = {
      host: 'mqtt.googleapis.com',
      port: 8883,
      clientId: mqttClientId,
      username: 'unused',
      password: this.createJwt(projectId, privateKeyFileName, algorithm),
      protocol: 'mqtts',
      secureProtocol: 'TLSv1_2_method',
    };
    return new CloudDevice(options, configTopic, stateTopic, telemetryTopic);
  }

  createJwt(projectId, privateKeyFileName, algorithm) {
    const token = {
      iat: parseInt(Date.now() / 1000, 10),
      exp: parseInt(Date.now() / 1000, 10) + 20 * 60, // 20 minutes
      aud: projectId,
    };
    const privateKey = fs.readFileSync(privateKeyFileName);
    return jwt.sign(token, privateKey, { algorithm });
  }
}

export default CloudDeviceFactory;
