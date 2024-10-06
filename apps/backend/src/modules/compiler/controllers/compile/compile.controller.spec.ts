import { InjectionType } from '@full-stack-project/shared';
import { Test, TestingModule } from '@nestjs/testing';
import { CompileService } from '../../services/compile/compile.service';
import { CompileController } from './compile.controller';

class MockCompileQueueService {
    process = jest.fn();
}

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
                    provide: 'BullQueue_' + InjectionType.CompilerQueueService,
                    useClass: MockCompileQueueService
                }
            ]
        }).compile();

        controller = module.get<CompileController>(CompileController);
    });

    it('It should success, compile controller', () => {
        expect(controller).toBeDefined();
    });
});
