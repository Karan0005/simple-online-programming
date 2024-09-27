import { Test, TestingModule } from '@nestjs/testing';
import { CompileService } from './compile.service';

describe('CompileService', () => {
    let service: CompileService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CompileService]
        }).compile();

        service = module.get<CompileService>(CompileService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
