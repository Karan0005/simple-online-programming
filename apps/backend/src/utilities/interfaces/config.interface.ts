export interface IApplicationConfiguration {
    server: {
        port: number;
        env: string;
        routePrefix: string;
        apiBaseURL: string;
        appBaseURL: string;
        secret: string;
    };
}

export interface ISecretManagerConfig {
    KeyVaultURI: string;
    TenantId: string;
    ClientId: string;
    ClientSecret: string;
}
