const { execSync } = require('child_process');
const args = process.argv.slice(2);
const dotenv = require('dotenv');
const path = require('path');

if (!args.length || !args[0].trim()) {
    console.log('No valid argument provided. Exiting...');
    process.exit(1);
}

// Setting environment variables from .env file
dotenv.config({ path: path.resolve(process.env.PWD || process.cwd(), '.env') });

async function ignite() {
    const argument = args[0].trim();
    const environment = process.env.APP_ENV;
    const port = process.env.PORT_FRONTEND;

    switch (argument) {
        case 'build': {
            let command =
                'npm run frontend:lint && npm run frontend:test && nx build frontend --configuration local --skip-nx-cache';
            switch (environment) {
                case 'DEV': {
                    command =
                        'npm run frontend:lint && npm run frontend:test && nx build frontend --configuration dev --skip-nx-cache';
                    break;
                }
                case 'UAT': {
                    command =
                        'npm run frontend:lint && npm run frontend:test && nx build frontend --configuration uat --skip-nx-cache';
                    break;
                }
                case 'PROD': {
                    command =
                        'npm run frontend:lint && npm run frontend:test && nx build frontend --configuration prod --skip-nx-cache';
                    break;
                }
            }
            execSync(command, { stdio: 'inherit' });
            break;
        }

        case 'serve': {
            let command = `nx serve frontend --configuration local --port ${port} --skip-nx-cache`;
            switch (environment) {
                case 'LOCAL': {
                    command = `nx serve frontend --configuration local --port ${port} --skip-nx-cache`;
                    break;
                }
                case 'DEV': {
                    command = `nx serve frontend --configuration dev --port ${port} --skip-nx-cache`;
                    break;
                }
                case 'UAT': {
                    command = `nx serve frontend --configuration uat --port ${port} --skip-nx-cache`;
                    break;
                }
                case 'PROD': {
                    command = `nx serve frontend --configuration prod --port ${port} --skip-nx-cache`;
                    break;
                }
            }
            execSync(command, { stdio: 'inherit' });
            break;
        }

        default:
            console.log('Invalid argument provided. Exiting...');
            process.exit(1);
    }
}

ignite();
