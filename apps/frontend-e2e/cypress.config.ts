import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        ...nxE2EPreset(__filename, {
            cypressDir: 'src',
            webServerCommands: {
                default: 'npx nx run frontend:serve',
                production: 'npx nx run frontend:serve-static'
            },
            ciWebServerCommand: 'npx nx run frontend:serve-static',
            ciBaseUrl: 'http://localhost:4200'
        }),
        baseUrl: 'http://localhost:4200',
        defaultCommandTimeout: 20000,
        pageLoadTimeout: 100000
    }
});
