import { EnvironmentEnum } from '@full-stack-project/shared';

export const CONFIG = {
    environment: EnvironmentEnum.DEV,
    production: false,
    apiUrl: 'http://128.199.31.53:8000/api', //Replace it with your dev server url
    logLevel: 'debug',
    enableDebugTools: true
};
