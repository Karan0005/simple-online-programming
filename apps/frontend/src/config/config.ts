import { EnvironmentEnum } from '@full-stack-project/shared';

export const CONFIG = {
    environment: EnvironmentEnum.LOCAL,
    production: false,
    apiUrl: 'http://localhost:8000/api',
    logLevel: 'debug',
    enableDebugTools: true
};
