const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

// Helper function to capitalize class names (kebab-case to PascalCase)
const makeClassName = (name) => {
    return name
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('');
};

/**
 * Runs Prettier and ESLint on the provided path.
 * @param {string} formatPath - Path where Prettier and ESLint should be run.
 */
const format = async (formatPath) => {
    execSync(
        `prettier ${formatPath}/**/*.{js,ts,scss,html,json} --write && eslint ${formatPath}/**/*.{ts,js} --fix`,
        { stdio: 'pipe' }
    );
};

/**
 * Main function to scaffold the module by asking user input.
 */
const generateModule = async () => {
    let absoluteModulePath = '';

    try {
        // Get input from the user for project type, module name, and additional options
        const { projectName, moduleName, componentName, controllerName } =
            await inquirer.default.prompt([
                {
                    type: 'list',
                    name: 'projectName',
                    message: 'Where would you like to place the module?',
                    choices: ['frontend', 'backend']
                },
                {
                    type: 'input',
                    name: 'moduleName',
                    message: 'Enter the name of the new module (e.g., file-manager):',
                    validate: (input) =>
                        /^[a-z][a-z0-9-]*$/.test(input) ||
                        'Module name must be in kebab-case and not empty.'
                },
                {
                    type: 'input',
                    name: 'componentName',
                    message: 'Enter the name of the new component (e.g., dashboard):',
                    validate: (input) =>
                        /^[a-z][a-z0-9-]*$/.test(input) ||
                        'Component name must be in kebab-case and not empty.',
                    when: (answers) => answers.projectName === 'frontend'
                },
                {
                    type: 'input',
                    name: 'controllerName',
                    message: 'Enter the name of the new controller (e.g., dashboard):',
                    validate: (input) =>
                        /^[a-z][a-z0-9-]*$/.test(input) ||
                        'Controller name must be in kebab-case and not empty.',
                    when: (answers) => answers.projectName === 'backend'
                }
            ]);

        // Define module paths
        const relativeModulePath = path.posix.join('apps', projectName, 'src', 'modules');
        absoluteModulePath = path.posix.join(process.cwd(), relativeModulePath, moduleName);

        // Check if the module already exists
        if (fs.existsSync(absoluteModulePath)) {
            console.error(
                chalk.red(`The module '${moduleName}' already exists in the app: ${projectName}`)
            );
            process.exit(1);
        }

        // Generate the module based on whether it's frontend or backend
        if (projectName === 'frontend') {
            await createModule(
                'frontend',
                absoluteModulePath,
                relativeModulePath,
                moduleName,
                componentName
            );
        } else {
            await createModule(
                'backend',
                absoluteModulePath,
                relativeModulePath,
                moduleName,
                controllerName
            );
        }

        // Format files using Prettier and ESLint
        await format(path.posix.join(relativeModulePath, moduleName));
        console.log(chalk.green(`Module ${moduleName} has been successfully scaffolded!`));
    } catch (error) {
        // Rollback in case of error
        console.log(error);
        // if (absoluteModulePath) fs.rmSync(absoluteModulePath, { recursive: true, force: true });
        console.error(chalk.red(`An error occurred: ${error.message}`));
    }
};

/**
 * Creates module by generating required directories and files.
 * Dynamically handles both frontend and backend projects.
 * @param {string} projectType - Type of the project ('frontend' or 'backend').
 * @param {string} absoluteModulePath - Absolute path for the module.
 * @param {string} relativeModulePath - Relative path for the module.
 * @param {string} moduleName - Name of the module.
 * @param {string} entityName - Name of the component (for frontend) or controller (for backend).
 */
const createModule = async (
    projectType,
    absoluteModulePath,
    relativeModulePath,
    moduleName,
    entityName
) => {
    const dirs = getDirectories(projectType, entityName); // Get required directories for the module
    const files = getFilesToCreate(projectType, entityName, moduleName); // Get the list of files to be created

    // Ensure required directories exist
    await Promise.all(dirs.map((dir) => fs.ensureDir(path.posix.join(absoluteModulePath, dir))));

    // Create the files with appropriate content
    await Promise.all(
        files.map((file) =>
            createFile(
                projectType,
                file,
                absoluteModulePath,
                relativeModulePath,
                moduleName,
                entityName
            )
        )
    );
};

/**
 * Returns an array of directories required for the module.
 * @param {string} projectType - Type of the project ('frontend' or 'backend').
 * @param {string} entityName - Name of the entity (component/controller).
 * @returns {Array<string>} - List of directory paths.
 */
const getDirectories = (projectType, entityName) => {
    if (projectType === 'frontend') {
        return [
            'components',
            `components/${entityName}`,
            'services',
            `services/${entityName}`,
            'interfaces'
        ];
    } else {
        return [
            'controllers',
            `controllers/${entityName}`,
            'validators',
            'interfaces',
            'services',
            `services/${entityName}`,
            'swagger'
        ];
    }
};

/**
 * Returns an array of files to be created for the module.
 * @param {string} projectType - Type of the project ('frontend' or 'backend').
 * @param {string} entityName - Name of the entity (component/controller).
 * @param {string} moduleName - Name of the module.
 * @returns {Array<Object>} - List of file paths and names.
 */
const getFilesToCreate = (projectType, entityName, moduleName) => {
    if (projectType === 'frontend') {
        return [
            { dir: '', name: `${moduleName}.module.ts` },
            { dir: 'components', name: 'index.ts' },
            { dir: `components/${entityName}`, name: `${entityName}.component.ts` },
            { dir: `components/${entityName}`, name: `${entityName}.component.spec.ts` },
            { dir: `components/${entityName}`, name: `${entityName}.component.html` },
            { dir: `components/${entityName}`, name: `${entityName}.component.scss` },
            { dir: `services/${entityName}`, name: `${entityName}.service.ts` },
            { dir: `services/${entityName}`, name: `${entityName}.service.spec.ts` },
            { dir: 'services', name: 'index.ts' },
            { dir: 'interfaces', name: `${entityName}.interface.ts` },
            { dir: 'interfaces', name: 'index.ts' }
        ];
    } else {
        return [
            { dir: '', name: `${moduleName}.module.ts` },
            { dir: 'controllers', name: 'index.ts' },
            { dir: `controllers/${entityName}`, name: `${entityName}.controller.ts` },
            { dir: `controllers/${entityName}`, name: `${entityName}.controller.spec.ts` },
            { dir: 'services', name: 'index.ts' },
            { dir: `services/${entityName}`, name: `${entityName}.service.ts` },
            { dir: `services/${entityName}`, name: `${entityName}.service.spec.ts` },
            { dir: 'interfaces', name: 'index.ts' },
            { dir: 'interfaces', name: `${entityName}.interface.ts` },
            { dir: 'validators', name: 'index.ts' },
            { dir: 'validators', name: `${entityName}.validator.ts` },
            { dir: 'swagger', name: 'index.ts' },
            { dir: 'swagger', name: `${entityName}.props.swagger.ts` }
        ];
    }
};

/**
 * Creates a file and writes generated content based on the project type and file type.
 * @param {string} projectType - Type of the project ('frontend' or 'backend').
 * @param {Object} file - File object containing directory and name.
 * @param {string} absoluteModulePath - Absolute path for the module.
 * @param {string} relativeModulePath - Relative path for the module.
 * @param {string} moduleName - Name of the module.
 * @param {string} entityName - Name of the component or controller.
 */
const createFile = async (
    projectType,
    file,
    absoluteModulePath,
    relativeModulePath,
    moduleName,
    entityName
) => {
    const filePath = path.posix.join(absoluteModulePath, file.dir, file.name);
    const fileContent =
        projectType === 'frontend'
            ? generateFrontendFileContent(file.dir, file.name, {
                  entityName: entityName,
                  moduleName: moduleName
              })
            : generateBackendFileContent(file.dir, file.name, {
                  entityName: entityName,
                  moduleName: moduleName
              });

    // Write the file content
    await fs.writeFile(filePath, fileContent);
    console.log(
        chalk.green('CREATE ') +
            path.posix.join(
                relativeModulePath,
                moduleName,
                file.dir ? path.posix.join(file.dir, file.name) : file.name
            )
    );
};

/**
 * Generate content for frontend files.
 * @param {string} dir - Directory where the file will be created.
 * @param {string} filename - File name.
 * @param {Object} options - Options containing entityName, moduleName.
 * @returns {string} - Generated file content.
 */
const generateFrontendFileContent = (dir, filename, { entityName, moduleName }) => {
    const moduleClassName = makeClassName(moduleName) + 'Module';
    const componentClassName = makeClassName(entityName) + 'Component';
    const serviceClassName = makeClassName(entityName) + 'Service';
    switch (dir) {
        case '': {
            return `
                    import { CommonModule } from '@angular/common';
                    import { NgModule } from '@angular/core';
                    import { ${componentClassName} } from './components';
                    import { ${serviceClassName} } from './services';

                    @NgModule({
                        declarations: [${componentClassName}],
                        imports: [CommonModule],
                        providers: [${serviceClassName}]
                    })
                    export class ${moduleClassName} {}
                `;
        }
        case 'components': {
            return `
                import { ${componentClassName} } from './${entityName}/${entityName}.component';

                export { ${componentClassName} };
            `;
        }
        case `components/${entityName}`: {
            if (filename.includes('spec.ts')) {
                return `
                    import { ComponentFixture, TestBed } from '@angular/core/testing';
                    import { ${componentClassName} } from './${entityName}.component';

                    describe('${componentClassName}', () => {
                        let component: ${componentClassName};
                        let fixture: ComponentFixture<${componentClassName}>;

                        beforeEach(async () => {
                            await TestBed.configureTestingModule({
                                declarations: [${componentClassName}]
                            }).compileComponents();

                            fixture = TestBed.createComponent(${componentClassName});
                            component = fixture.componentInstance;
                            fixture.detectChanges();
                        });

                        it('It should success, ${entityName} component', () => {
                            expect(component).toBeTruthy();
                        });
                    });
                `;
            } else if (filename.includes('component.ts')) {
                return `
                    import { Component } from '@angular/core';

                    @Component({
                        selector: 'app-${moduleName}-${entityName}',
                        templateUrl: './${entityName}.component.html',
                        styleUrl: './${entityName}.component.scss'
                    })
                    export class ${componentClassName} {}
                `;
            } else if (filename.includes('component.html')) {
                return `
                    <p>${entityName} works!</p>
                `;
            } else {
                return '';
            }
        }
        case 'services': {
            return `
                import { ${serviceClassName} } from './${entityName}/${entityName}.service';

                export { ${serviceClassName} };
            `;
        }
        case `services/${entityName}`: {
            if (filename.includes('spec.ts')) {
                return `
                    import { TestBed } from '@angular/core/testing';
                    import { ${serviceClassName} } from './${entityName}.service';

                    describe('${serviceClassName}', () => {
                        let service: ${serviceClassName};

                        beforeEach(() => {
                            TestBed.configureTestingModule({});
                            service = TestBed.inject(${serviceClassName});
                        });

                        it('It should success, ${entityName} service', () => {
                            expect(service).toBeTruthy();
                        });
                    });
                `;
            } else if (filename.includes('service.ts')) {
                return `
                    import { Injectable } from '@angular/core';

                    @Injectable({
                        providedIn: 'root'
                    })
                    export class ${serviceClassName} {}
                `;
            } else {
                return '';
            }
        }
        default:
            return '';
    }
};

/**
 * Generate content for backend files.
 * @param {string} dir - Directory where the file will be created.
 * @param {string} filename - File name.
 * @param {Object} options - Options containing entityName, moduleName.
 * @returns {string} - Generated file content.
 */
const generateBackendFileContent = (dir, filename, { entityName, moduleName }) => {
    const moduleClassName = makeClassName(moduleName) + 'Module';
    const controllerClassName = makeClassName(entityName) + 'Controller';
    const serviceClassName = makeClassName(entityName) + 'Service';

    switch (dir) {
        case '': {
            return `
                import { Module } from '@nestjs/common';
                import { ${controllerClassName} } from './controllers';
                import { ${serviceClassName} } from './services';

                @Module({
                    controllers: [${controllerClassName}],
                    providers: [${serviceClassName}]
                })
                export class ${moduleClassName} {}
            `;
        }
        case 'controllers': {
            return `
                import { ${controllerClassName} } from './${entityName}/${entityName}.controller';

                export { ${controllerClassName} };
            `;
        }
        case `controllers/${entityName}`: {
            if (filename.includes('spec.ts')) {
                return `
                    import { Test, TestingModule } from '@nestjs/testing';
                    import { ${controllerClassName} } from './${entityName}.controller';

                    describe('${controllerClassName}', () => {
                        let controller: ${controllerClassName};

                        beforeEach(async () => {
                            const module: TestingModule = await Test.createTestingModule({
                                controllers: [${controllerClassName}]
                            }).compile();

                            controller = module.get<${controllerClassName}>(${controllerClassName});
                        });

                        it('It should success, ${entityName} controller', () => {
                            expect(controller).toBeDefined();
                        });
                    });
                `;
            } else if (filename.includes('controller.ts')) {
                return `
                    import { Controller } from '@nestjs/common';

                    @Controller('${entityName}')
                    export class ${controllerClassName} {}
                `;
            } else {
                return '';
            }
        }
        case 'services': {
            return `
                import { ${serviceClassName} } from './${entityName}/${entityName}.service';

                export { ${serviceClassName} };
            `;
        }
        case `services/${entityName}`: {
            if (filename.includes('spec.ts')) {
                return `
                    import { Test, TestingModule } from '@nestjs/testing';
                    import { ${serviceClassName} } from './${entityName}.service';

                    describe('${serviceClassName}', () => {
                        let service: ${serviceClassName};

                        beforeEach(async () => {
                            const module: TestingModule = await Test.createTestingModule({
                                providers: [${serviceClassName}]
                            }).compile();

                            service = module.get<${serviceClassName}>(${serviceClassName});
                        });

                        it('should be defined', () => {
                            expect(service).toBeDefined();
                        });
                    });
                `;
            } else if (filename.includes('service.ts')) {
                return `
                    import { Injectable } from '@nestjs/common';

                    @Injectable()
                    export class ${serviceClassName} {}
                `;
            } else {
                return '';
            }
        }
        default:
            return '';
    }
};

// Start the module generation process
generateModule();
