import { BaseMessage } from '@full-stack-project/shared';
import { ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppService', () => {
    let appService: AppService;
    let configService: ConfigService;

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [TerminusModule],
            controllers: [AppController],
            providers: [AppService, ConfigService]
        }).compile();

        appService = app.get<AppService>(AppService);
        configService = app.get<ConfigService>(ConfigService);
    });

    describe('rootRoute', () => {
        it(`It should success, root route service`, async () => {
            const response = appService.rootRoute();
            const environment = configService.get('server.env') ?? '';
            expect(response).toEqual({ Information: BaseMessage.Success.RootRoute(environment) });
        });
    });

    describe('checkHealth', () => {
        it('It should success, health route service', async () => {
            const response = await appService.checkHealth();
            expect(response.status).toBe('ok');
        });
    });
});
