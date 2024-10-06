import { Injectable, LoggerService } from '@nestjs/common';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class DockerService {
    private readonly logger: LoggerService;
    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    async pullDockerImages(): Promise<void> {
        const images = [
            'gcc:14.2.0',
            'openjdk:18-jdk',
            'python:3.12.5',
            'golang:1.23.0',
            'node:22.8.0',
            'php:8.3.11',
            'mcr.microsoft.com/dotnet/sdk:8.0.401',
            'swift:5.10.1',
            'r-base:4.4.1',
            'ruby:3.3.4',
            'rust:1.80.1',
            'perl:5.40.0'
        ];

        for (const image of images) {
            try {
                this.logger.log(`Pulling image: ${image}`);
                await execAsync(`docker pull ${image}`);
            } catch (error) {
                this.logger.error(`Error pulling image ${image}:`, error);
                throw new Error(`Failed to pull image ${image}`);
            }
        }
    }

    async buildCustomImages(): Promise<void> {
        const customImages = [
            {
                name: 'openjdk:kotlin',
                dockerfilePath: path.resolve(__dirname, 'assets', 'Dockerfile.kotlin')
            },
            {
                name: 'nodejs:typescript',
                dockerfilePath: path.resolve(__dirname, 'assets', 'Dockerfile.typescript')
            }
        ];

        for (const image of customImages) {
            try {
                this.logger.log(`Building custom image: ${image.name}`);
                const contextPath = path.resolve(__dirname);
                const command = `docker build -t ${image.name} -f "${image.dockerfilePath}" "${contextPath}"`;
                await execAsync(command);
            } catch (error) {
                this.logger.error(`Error building image ${image.name}:`, error);
                throw new Error(`Failed to build image ${image.name}`);
            }
        }
    }

    async setupDockerImages(): Promise<void> {
        await this.pullDockerImages();
        await this.buildCustomImages();
    }
}
