import { BaseMessage } from '@full-stack-project/shared';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    DiskHealthIndicator,
    HealthCheckResult,
    HealthCheckService,
    MemoryHealthIndicator
} from '@nestjs/terminus';
import { IRootRouteResponse } from './app.interface';

@Injectable()
export class AppService {
    private readonly appEnvironment: string;

    constructor(
        private readonly health: HealthCheckService,
        private readonly memoryHealthIndicator: MemoryHealthIndicator,
        private readonly diskHealthIndicator: DiskHealthIndicator,
        config: ConfigService
    ) {
        this.appEnvironment = config.get('server.env') ?? '';
    }

    rootRoute(): IRootRouteResponse {
        return { Information: BaseMessage.Success.RootRoute(this.appEnvironment) };
    }

    checkHealth(): Promise<HealthCheckResult> {
        return this.health.check([
            // The process should not use more than 300MB memory
            () => this.memoryHealthIndicator.checkHeap('HEAP_Memory', 300 * 1024 * 1024),
            // The process should not have more than 300MB RSS memory allocated
            () => this.memoryHealthIndicator.checkRSS('RSS_Memory', 300 * 1024 * 1024),
            // The used disk storage should not exceed the 90% of the available space
            () =>
                this.diskHealthIndicator.checkStorage('DISK_Health', {
                    thresholdPercent: 0.9,
                    path: __dirname
                })
        ]);
    }
}
