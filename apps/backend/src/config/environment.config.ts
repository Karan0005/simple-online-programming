import { IApplicationConfiguration, SecretManagerService } from '@backend/utilities';
import { BaseMessage, EnvironmentEnum } from '@full-stack-project/shared';
import { LoggerService } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Setting environment variables from .env file
dotenv.config({ path: path.resolve(process.env.PWD ?? process.cwd(), '.env') });

let serverSecret: string | undefined;

const appEnv: string = process.env.APP_ENV ?? EnvironmentEnum.LOCAL;
const keyVaultEnv: string =
    appEnv === EnvironmentEnum.LOCAL ? EnvironmentEnum.DEV.toLowerCase() : appEnv.toLowerCase();
const keyVaultURI: string = 'https://' + keyVaultEnv + '-' + process.env.KEY_VAULT_URI;

const portBackend = process.env['PORT_BACKEND'] ? +process.env['PORT_BACKEND'] : 8000;
const portFrontend = process.env['PORT_FRONTEND'] ? +process.env['PORT_FRONTEND'] : 4000;

export async function setupSecretValues(logger: LoggerService) {
    try {
        const secretManagerService = new SecretManagerService({
            KeyVaultURI: keyVaultURI,
            TenantId: process.env.TENANT_ID ?? '',
            ClientId: process.env.CLIENT_ID ?? '',
            ClientSecret: process.env.CLIENT_SECRET ?? ''
        });

        //Preparing Async Calls for Getting Secret Values
        const asyncCalls: Promise<string | undefined>[] = [
            secretManagerService.getSecretValue('SERVER-SECRET')
        ];

        //Calling key vault service in parallel to get secret values
        [serverSecret] = await Promise.all(asyncCalls);
    } catch (error) {
        logger.error(error);
    }
}

export function environment(): IApplicationConfiguration {
    if (!serverSecret) {
        throw Error(BaseMessage.Error.SecretKeyNotFound);
    }

    return {
        server: {
            env: appEnv,
            port: portBackend,
            routePrefix: process.env.ROUTE_PREFIX ?? 'api',
            apiBaseURL: getAPIBaseURL(appEnv),
            appBaseURL: getAPPBaseURL(appEnv),
            secret: serverSecret
        }
    };
}

function getAPIBaseURL(environment: string | undefined) {
    switch (environment) {
        case EnvironmentEnum.LOCAL: {
            return 'http://localhost:' + portBackend;
        }
        case EnvironmentEnum.DEV: {
            return 'http://128.199.31.53:8000'; //Replace it with your dev server url
        }
        case EnvironmentEnum.UAT: {
            return 'http://128.199.31.53:8000'; //Replace it with your uat server url
        }
        case EnvironmentEnum.PROD: {
            return 'http://128.199.31.53:8000'; //Replace it with your prod server url
        }
        default: {
            return 'http://localhost:' + portBackend;
        }
    }
}

function getAPPBaseURL(environment: string | undefined) {
    switch (environment) {
        case EnvironmentEnum.LOCAL: {
            return 'http://localhost:' + portFrontend;
        }
        case EnvironmentEnum.DEV: {
            return 'http://128.199.31.53'; //Replace it with your dev server url
        }
        case EnvironmentEnum.UAT: {
            return 'http://128.199.31.53'; //Replace it with your uat server url
        }
        case EnvironmentEnum.PROD: {
            return 'http://128.199.31.53'; //Replace it with your prod server url
        }
        default: {
            return 'http://localhost:' + portFrontend;
        }
    }
}
