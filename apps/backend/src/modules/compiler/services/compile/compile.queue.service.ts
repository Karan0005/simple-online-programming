import { InjectionType } from '@full-stack-project/shared';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { ICompileCodeResponse, ICompilerService } from '../../interfaces';
import { CompileCodeValidator } from '../../validators';

@Processor(InjectionType.CompilerQueueService)
export class CompileQueueService extends WorkerHost {
    constructor(
        @Inject(InjectionType.CompilerService) private readonly compilerService: ICompilerService
    ) {
        super();
    }

    async process(job: Job<CompileCodeValidator>): Promise<ICompileCodeResponse> {
        return await this.compilerService.compileCode(job.data);
    }
}
