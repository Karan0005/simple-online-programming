import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execSync } from 'child_process';
import semver from 'semver';

export class DependencyChecker {
    private readonly logger: LoggerService;
    private readonly configService: ConfigService;

    constructor(logger: LoggerService, configService: ConfigService) {
        this.logger = logger;
        this.configService = configService;
    }

    public async verify(): Promise<void> {
        await this.checkDocker();
        await this.checkRedis();
    }

    private async checkDocker(): Promise<void> {
        try {
            execSync('docker --version 2>&1', { encoding: 'utf8' });
            execSync('docker info 2>&1', { encoding: 'utf8' });
            this.logger.log(`Docker is found and running.`);
        } catch (error) {
            throw new Error('Docker is not up and running');
        }
    }

    private async checkRedis(): Promise<void> {
        const minVersion = this.configService.get('redis.minVersion');
        const redisHost = this.configService.get('redis.host');
        const redisPort = this.configService.get('redis.port');

        try {
            const redisPingCommand = `redis-cli -h ${redisHost} -p ${redisPort} ping 2>&1`;
            const result = execSync(redisPingCommand, { encoding: 'utf8' })?.trim();

            if (result === 'PONG') {
                const currentRedisVersion = execSync('redis-cli --version 2>&1', {
                    encoding: 'utf8'
                })?.split(' ')[1];

                if (currentRedisVersion && semver.gte(currentRedisVersion, minVersion)) {
                    this.logger.log(
                        `Redis greater then or equal to ${minVersion} found and running.`
                    );
                    return;
                }
            }

            throw new Error(`Redis ${minVersion} is not up and running.`);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            throw new Error(`Redis ${minVersion} is not up and running.`);
        }
    }
}
