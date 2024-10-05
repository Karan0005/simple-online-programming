/* eslint-disable */
const { spawn, ChildProcess } = require('child_process');
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { setTimeout } from 'timers/promises';
let backendProcess: typeof ChildProcess | undefined;

dotenv.config({ path: path.resolve(process.env.PWD ?? process.cwd(), '.env') });

const host = 'localhost';
const port = process.env.PORT_BACKEND ?? '8000';
const routePrefix = process.env.ROUTE_PREFIX ?? 'api';
axios.defaults.baseURL = `http://${host}:${port}/${routePrefix}`;

const startBackendServer = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        console.log('\nStarting backend server...\n');

        backendProcess = spawn('node', ['dist/apps/backend/main'], {
            stdio: 'inherit',
            shell: true
        });

        backendProcess.on('exit', (code: number) => {
            if (code !== 0) {
                reject(new Error(`Backend server exited with code ${code}`));
            }
        });

        backendProcess.on('error', (error: Error) => {
            reject(error);
        });

        const checkBackendHealth = async () => {
            while (true) {
                try {
                    const response = await axios.get('/health');
                    if (response.status === 200) {
                        console.log('Backend server is healthy and running.');
                        resolve();
                        break;
                    }
                } catch (error) {
                    await setTimeout(1000);
                }
            }
        };

        checkBackendHealth();
    });
};

module.exports = async function () {
    try {
        await startBackendServer();

        // Now run your E2E tests here after the backend server has started
        console.log('Backend is up. Proceeding with E2E tests...');
    } catch (error) {
        console.error('Error starting the backend server:', error);
        process.exit(1);
    }
};

module.exports.teardown = async function () {
    if (backendProcess) {
        console.log('\nStopping backend server...\n');
        backendProcess.kill('SIGTERM');
        backendProcess.kill('SIGINT');
        process.exit(0);
    } else {
        console.log('No backend server process to stop.');
    }
};
