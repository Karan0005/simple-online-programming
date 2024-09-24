import { EnvironmentEnum } from '@full-stack-project/shared';

export const CONFIG = {
    environment: EnvironmentEnum.UAT,
    production: false,
    apiUrl: 'http://128.199.31.53:8000/api', //Replace it with your uat server url
    logLevel: 'debug',
    enableDebugTools: true
};
