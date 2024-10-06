import { InjectionType } from '@full-stack-project/shared';
import { Test, TestingModule } from '@nestjs/testing';
import { CompileService } from './compile.service';

class MockCompileQueueService {
    process = jest.fn();
}

describe('CompileService', () => {
    let service: CompileService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompileService,
                {
                    provide: 'BullQueue_' + InjectionType.CompilerQueueService,
                    useClass: MockCompileQueueService
                }
            ]
        }).compile();

        service = module.get<CompileService>(CompileService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
