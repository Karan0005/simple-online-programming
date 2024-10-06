import { InjectionType } from '@full-stack-project/shared';
import { Test, TestingModule } from '@nestjs/testing';
import { CompileQueueService, CompileService } from '../../services';
import { CompileController } from './compile.controller';

describe('CompileController', () => {
    let controller: CompileController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompileController],
            providers: [
                {
                    provide: InjectionType.CompilerService,
                    useClass: CompileService
                },
                {
                    provide: 'BullQueue_' + InjectionType.CompileQueueService,
                    useClass: CompileQueueService
                }
            ]
        }).compile();

        controller = module.get<CompileController>(CompileController);
    });

    it('It should success, compile controller', () => {
        expect(controller).toBeDefined();
    });
});
