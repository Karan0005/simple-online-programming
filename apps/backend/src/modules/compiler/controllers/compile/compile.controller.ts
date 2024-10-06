import { ControllerExceptionProcessor } from '@backend/utilities';
import { BaseMessage, InjectionType } from '@full-stack-project/shared';
import { InjectQueue } from '@nestjs/bullmq';
import {
    Body,
    Controller,
    Get,
    Inject,
    InternalServerErrorException,
    Param,
    Post
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Queue } from 'bullmq';
import { ICompileCodeResponse, ICompilerController, ICompilerService } from '../../interfaces';
import { CompileCodeResponse, CompileCodeUsingQueueResponse } from '../../swagger';
import { CompileCodeValidator } from '../../validators';

@Controller('compile')
export class CompileController implements ICompilerController {
    constructor(
        @Inject(InjectionType.CompilerService) private readonly compilerService: ICompilerService,
        @InjectQueue(InjectionType.CompileQueueService) private readonly compileQueue: Queue
    ) {}

    @Post('/v1')
    @ApiOperation({ summary: 'Compile Code' })
    @ApiResponse({
        status: BaseMessage.SwaggerMessage.Response.Ok.Status,
        description: BaseMessage.SwaggerMessage.Response.Ok.Description,
        type: CompileCodeResponse
    })
    async compileCode(@Body() params: CompileCodeValidator): Promise<ICompileCodeResponse> {
        try {
            return await this.compilerService.compileCode(params);
        } catch (error) {
            throw ControllerExceptionProcessor(error);
        }
    }

    @Post('/queue/v1')
    @ApiOperation({ summary: 'Compile Code Using Queue' })
    @ApiResponse({
        status: BaseMessage.SwaggerMessage.Response.Ok.Status,
        description: BaseMessage.SwaggerMessage.Response.Ok.Description,
        type: CompileCodeUsingQueueResponse
    })
    async compileCodeUsingQueue(@Body() params: CompileCodeValidator): Promise<{ JobId: string }> {
        try {
            const job = await this.compileQueue.add(params.ProgrammingLanguage, params);

            if (job.id) {
                return { JobId: job.id };
            }

            throw new InternalServerErrorException(BaseMessage.Error.SomethingWentWrong);
        } catch (error) {
            throw ControllerExceptionProcessor(error);
        }
    }

    @Get('/job/status/v1/:jobId')
    @ApiOperation({ summary: 'Get Compile Job Status' })
    @ApiResponse({
        status: BaseMessage.SwaggerMessage.Response.Ok.Status,
        description: BaseMessage.SwaggerMessage.Response.Ok.Description,
        type: CompileCodeResponse
    })
    async getCompileJobStatus(
        @Param('jobId') jobId: string
    ): Promise<ICompileCodeResponse | undefined> {
        try {
            const job = await this.compileQueue.getJob(jobId);
            if (job) {
                const isFailed = await job.isFailed();
                if (isFailed) {
                    throw new InternalServerErrorException(job.failedReason);
                }

                const isCompleted = await job.isCompleted();
                if (isCompleted) {
                    return job.returnvalue;
                }
            }
        } catch (error) {
            throw ControllerExceptionProcessor(error);
        }
    }
}
