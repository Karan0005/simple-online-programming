const fs = require('fs');
const path = require('path');

const sampleEnvPath = path.resolve(__dirname, '..', '.env.sample');
const envPath = path.resolve(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
    fs.copyFileSync(sampleEnvPath, envPath);
}
