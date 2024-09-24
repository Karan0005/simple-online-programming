const { exec } = require('child_process');
const ora = require('ora');
const util = require('util');

// Promisify exec for better async handling
const execPromise = util.promisify(exec);

// Function to check if the `code` command is available
async function isCodeInstalled() {
    try {
        await execPromise('code -v');
        return true; // Resolves true if code is installed
    } catch {
        return false; // Resolves false otherwise
    }
}

// Function to install VS Code extensions with ora spinner
async function installExtensions() {
    const extensions = [
        'esbenp.prettier-vscode',
        'firsttris.vscode-jest-runner',
        'eamodio.gitlens',
        'streetsidesoftware.code-spell-checker',
        'kisstkondoros.vscode-codemetrics',
        'dbaeumer.vscode-eslint',
        'visualstudioexptteam.vscodeintellicode',
        'visualstudioexptteam.intellicode-api-usage-examples',
        'pkief.material-icon-theme',
        'nrwl.angular-console',
        'sonarsource.sonarlint-vscode',
        'redhat.vscode-yaml'
    ];

    const spinner = ora('Installing VS Code extensions...').start();
    for (const ext of extensions) {
        try {
            spinner.start(`Installing extension ${ext}`);
            await execPromise(`code --install-extension ${ext} --force`);
            spinner.succeed(`Installed ${ext}`);
        } catch {
            spinner.warn(`Skipped ${ext}`); // Display as a warning without throwing an error
        }
    }
}

async function main() {
    const spinner = ora('Checking for VS Code CLI...').start();
    try {
        const codeInstalled = await isCodeInstalled();
        if (codeInstalled) {
            spinner.succeed('VS Code CLI found.');
            await installExtensions();
        } else {
            spinner.warn(
                "VS Code CLI not found. Please install VS Code or ensure it's added to your PATH."
            );
        }
    } catch {
        spinner.warn('An error occurred during installation.');
    } finally {
        spinner.stop();
    }
}

main();
