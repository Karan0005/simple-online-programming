import { EnvironmentEnum } from '@full-stack-project/shared';

export const CONFIG = {
    environment: EnvironmentEnum.PROD,
    production: true,
    apiUrl: 'http://128.199.31.53:8000/api', //Replace it with your prod server url
    logLevel: 'error',
    enableDebugTools: false
};
