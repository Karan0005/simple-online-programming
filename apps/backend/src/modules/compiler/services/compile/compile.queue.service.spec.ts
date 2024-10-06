import { InjectionType } from '@full-stack-project/shared';
import { Test, TestingModule } from '@nestjs/testing';
import { CompileQueueService } from './compile.queue.service';
import { CompileService } from './compile.service';

describe('CompileQueueService', () => {
    let service: CompileQueueService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: InjectionType.CompilerService,
                    useClass: CompileService
                },
                CompileQueueService
            ]
        }).compile();

        service = module.get<CompileQueueService>(CompileQueueService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
