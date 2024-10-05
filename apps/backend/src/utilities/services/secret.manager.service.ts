import { Injectable } from '@nestjs/common';
import { ISecretManagerConfig } from '../interfaces';

@Injectable()
export class SecretManagerService {
    constructor(_secretManagerConfig: ISecretManagerConfig) {
        /**
         * use secretManagerConfig to connect with your favorite secret manager might need to adjust config variables as per the requirement.
         *
         * for example if you are using azure secret manager
         * const azureKeyVaultCredentials = new ClientSecretCredential(_secretManagerConfig.TenantId, _secretManagerConfig.ClientId, _secretManagerConfig.ClientSecret);
         * this.client = new SecretClient(_secretManagerConfig.KeyVaultURI, azureKeyVaultCredentials);
         */
    }

    public async getSecretValue(_secretName: string): Promise<string | undefined> {
        /**
         * search the requested _secretName in your secret manager and return the value
         *
         * for example if you are using azure secret manager
         * return (await this.client.getSecret(_secretName)).value;
         *
         * where client is the initialized class object of azure secret client
         */
        return 'Welcome@1'; //This is just illustration, need to replace it with actual secret at runtime from key vault
    }
}
