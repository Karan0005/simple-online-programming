const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const ora = require('ora');

const execPromise = util.promisify(exec);

// Paths
const projectRoot = path.resolve(__dirname, '..');
const nodeModulesPath = path.resolve(projectRoot, 'node_modules');
const packageJsonPath = path.resolve(projectRoot, 'package.json');
const packageLockPath = path.resolve(projectRoot, 'package-lock.json');
const backupPath = path.resolve(projectRoot, 'backup');
const backupPackageJsonPath = path.join(backupPath, 'package.json');
const backupPackageLockPath = path.join(backupPath, 'package-lock.json');

// Spinner Manager
class SpinnerManager {
    constructor() {
        this.spinner = null;
    }

    start(message) {
        if (this.spinner) {
            this.spinner.stop();
        }
        this.spinner = ora(message).start();
    }

    succeed(message) {
        if (this.spinner) {
            this.spinner.succeed(message);
            this.spinner = null;
        }
    }

    fail(message) {
        if (this.spinner) {
            this.spinner.fail(message);
            this.spinner = null;
        }
    }

    stop() {
        if (this.spinner) {
            this.spinner.stop();
        }
    }
}

// Initialize SpinnerManager
const spinnerManager = new SpinnerManager();

// Run shell command
const runCommand = async (cmd, args, cwd = process.cwd()) => {
    try {
        await execPromise(`${cmd} ${args.join(' ')}`, { cwd, stdio: 'ignore' });
    } catch (error) {
        throw new Error(`Command "${cmd} ${args.join(' ')}" failed: ${error.message}`);
    }
};

// Backup function
const backupProject = async () => {
    spinnerManager.start('Preparing backup...');
    try {
        if (!fs.existsSync(backupPath)) fs.mkdirSync(backupPath, { recursive: true });
        fs.copyFileSync(packageJsonPath, backupPackageJsonPath);
        fs.copyFileSync(packageLockPath, backupPackageLockPath);
        spinnerManager.succeed('Backup complete.');
    } catch (error) {
        spinnerManager.fail('Backup failed.');
        console.error(error);
        throw error;
    }
};

// Cleanup function
const cleanupProject = async () => {
    spinnerManager.start('Deleting node_modules...');
    try {
        if (fs.existsSync(nodeModulesPath)) {
            fs.rmSync(nodeModulesPath, { recursive: true, force: true });
            spinnerManager.succeed('node_modules deleted.');
        } else {
            spinnerManager.spinner.warn('node_modules directory not found.');
        }
    } catch (error) {
        spinnerManager.fail('Failed to delete node_modules.');
        console.error(error);
        throw error;
    }
};

// Update function with Nx, Angular, and NestJS smart upgrade
const updateProject = async () => {
    spinnerManager.start('Upgrading project dependencies...');
    try {
        spinnerManager.start('Installing latest npm...');
        await runCommand('npm', ['install', '-g', 'npm@latest']);
        spinnerManager.succeed('Latest npm installed.');

        spinnerManager.start('Upgrading npm modules...');
        await runCommand('npm', ['update'], projectRoot);
        spinnerManager.succeed('npm modules upgraded.');

        spinnerManager.start('Running Nx workspace migration...');
        await runCommand('npx', ['nx', 'migrate', 'latest']);
        spinnerManager.succeed('Nx workspace migrated successfully.');

        spinnerManager.start('Upgrading Angular CLI and dependencies...');
        await runCommand('npm', ['install', '@angular/cli@latest'], projectRoot);
        await runCommand(
            'npm',
            [
                'install',
                '@schematics/angular@latest',
                '@angular/animations@latest',
                '@angular/common@latest',
                '@angular/compiler@latest',
                '@angular/core@latest',
                '@angular/forms@latest',
                '@angular/platform-browser@latest',
                '@angular/platform-browser-dynamic@latest',
                '@angular/router@latest',
                '@angular-devkit/build-angular@latest',
                '@angular-devkit/core@latest',
                '@angular-devkit/schematics@latest',
                '@angular-eslint/eslint-plugin@latest',
                '@angular-eslint/eslint-plugin-template@latest',
                '@angular-eslint/template-parser@latest',
                '@angular/compiler-cli@latest',
                '@angular/language-service@latest'
            ],
            projectRoot
        );
        spinnerManager.succeed('Angular CLI and dependencies upgraded.');

        spinnerManager.start('Upgrading nest.js dependencies...');
        await runCommand(
            'npm',
            [
                'install',
                '@nestjs/config@latest',
                '@nestjs/swagger@latest',
                '@nestjs/terminus@latest',
                '@nestjs/common@latest',
                '@nestjs/core@latest',
                '@nestjs/platform-express@latest',
                '@nestjs/terminus@latest',
                '@nx/nest@latest',
                '@nestjs/schematics@latest',
                '@nestjs/testing@latest'
            ],
            projectRoot
        );
        spinnerManager.succeed('NestJS CLI and dependencies upgraded.');

        spinnerManager.start('Reinstalling npm modules...');
        await runCommand('npm', ['install'], projectRoot);
        spinnerManager.succeed('npm modules reinstalled.');
    } catch (error) {
        spinnerManager.fail('Failed to update dependencies.');
        console.error(error);
        throw error;
    }
};

// Build and test the project
const buildAndTestProject = async () => {
    spinnerManager.start('Building and testing project...');
    try {
        await runCommand('npm', ['run', 'backend:build'], projectRoot);
        await runCommand('npm', ['run', 'frontend:build'], projectRoot);
        spinnerManager.succeed('Build and tests completed successfully.');
        return true;
    } catch (error) {
        spinnerManager.fail('Build or tests failed.');
        console.error(error);
        return false;
    }
};

// Restore backup function
const restoreBackup = async () => {
    spinnerManager.start('Restoring backup...');
    try {
        fs.copyFileSync(backupPackageJsonPath, packageJsonPath);
        fs.copyFileSync(backupPackageLockPath, packageLockPath);
        await runCommand('npm', ['ci'], projectRoot);
        spinnerManager.succeed('Backup restored successfully.');
    } catch (error) {
        spinnerManager.fail('Failed to restore backup.');
        console.error(error);
        throw error;
    }
};

// Main function
const main = async () => {
    let buildAndTestPassed = false;
    spinnerManager.start('Starting upgrade process...');
    try {
        await backupProject();
        await cleanupProject();
        await updateProject();
        buildAndTestPassed = await buildAndTestProject();

        if (buildAndTestPassed) {
            spinnerManager.succeed('Upgrade process completed successfully.');
        } else {
            spinnerManager.start('Error detected, rolling back...');
            await restoreBackup();
        }
    } catch (error) {
        spinnerManager.fail('Error detected, rolling back...');
        console.error(error);
        await restoreBackup();
    } finally {
        spinnerManager.stop();
    }
};

main();
