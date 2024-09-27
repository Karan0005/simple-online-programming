import { ControllerExceptionProcessor } from '@backend/utilities';
import { BaseMessage, InjectionType } from '@full-stack-project/shared';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ICompileCodeResponse, ICompilerController, ICompilerService } from '../../interfaces';
import { CompileCodeResponse } from '../../swagger';
import { CompileCodeValidator } from '../../validators';

@Controller('compile')
export class CompileController implements ICompilerController {
    constructor(@Inject(InjectionType.CompilerService) private compilerService: ICompilerService) {}

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
}
