import { BaseMessage } from '@full-stack-project/shared';
import { ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;
    let configService: ConfigService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [TerminusModule],
            controllers: [AppController],
            providers: [AppService, ConfigService]
        }).compile();

        appController = app.get<AppController>(AppController);
        configService = app.get<ConfigService>(ConfigService);
    });

    describe('rootRoute', () => {
        it(`It should success, root route controller`, async () => {
            const response = await appController.rootRoute();
            const environment = configService.get('server.env') ?? '';
            expect(response).toEqual({ Information: BaseMessage.Success.RootRoute(environment) });
        });
    });

    describe('checkHealth', () => {
        it('It should success, health route controller', async () => {
            const response = await appController.checkHealth();
            expect(response.status).toBe('ok');
        });
    });
});
