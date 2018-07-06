import fs from 'fs';
import jwt from 'jsonwebtoken';

import CloudDevice from './CloudDevice';

class CloudDeviceFactory {
  create(region, projectId, registryId, deviceId, privateKeyFileName, algorithm) {
    const baseUri = 'https://cloudiotdevice.googleapis.com/v1';
    const configPath = `/projects/${projectId}/locations/${region}/registries/${registryId}/devices/${deviceId}/config`;
    const statePath = `/projects/${projectId}/locations/${region}/registries/${registryId}/devices/${deviceId}:setState`;
    const telemetryPath = `/projects/${projectId}/locations/${region}/registries/${registryId}/devices/${deviceId}:publishEvent`;
    const options = {
      headers: {
        'authorization': `Bearer ${this.createJwt(projectId, privateKeyFileName, algorithm)}`, // eslint-disable-line quote-props
        'cache-control': 'no-cache',
        'content-type': 'application/json',
      },
      json: true,
    };
    return new CloudDevice(baseUri, options, configPath, statePath, telemetryPath);
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
