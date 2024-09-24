const { execSync } = require('child_process');
const semver = require('semver');
const dotenv = require('dotenv');
const path = require('path');

// Setting environment variables from .env file
dotenv.config({ path: path.resolve(process.env.PWD || process.cwd(), '.env') });

// Define the minimum required versions from environment variables
const MIN_NODE_VERSION = process.env.MIN_NODE_VERSION;
const MIN_NPM_VERSION = process.env.MIN_NPM_VERSION;

const runCommand = (cmd) => {
    try {
        return execSync(cmd, { encoding: 'utf8' }).trim();
    } catch (err) {
        console.error(`Failed to execute command: ${cmd}`);
        return null; // Return null so that it can handle both errors
    }
};

// Get the current versions
const currentNodeVersion = runCommand('node -v')?.slice(1); // remove 'v' prefix
const currentNpmVersion = runCommand('npm -v');

let hasNodeError = false;
let hasNpmError = false;

// Validate the Node.js version
if (!currentNodeVersion || !semver.gte(currentNodeVersion, MIN_NODE_VERSION)) {
    console.error(
        `Error: Node.js version ${MIN_NODE_VERSION} or higher is required. Current version: ${
            currentNodeVersion || 'unknown'
        }`
    );
    console.error(`Please update Node.js or use nvm to select the correct version.`);
    hasNodeError = true;
}

// Validate the npm version
if (!currentNpmVersion || !semver.gte(currentNpmVersion, MIN_NPM_VERSION)) {
    if (hasNodeError) {
        console.error(); // Print a new line if both errors exist
    }
    console.error(
        `Error: npm version ${MIN_NPM_VERSION} or higher is required. Current version: ${
            currentNpmVersion || 'unknown'
        }`
    );
    console.error(`Please update npm or use nvm to select the correct version.`);
    hasNpmError = true;
}

// If any errors exist, exit the process
if (hasNodeError || hasNpmError) {
    process.exit(1);
}

console.log('Node.js and npm versions are valid.');
