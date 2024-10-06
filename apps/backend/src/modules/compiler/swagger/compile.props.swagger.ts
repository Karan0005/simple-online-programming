import { APISuccessResponse, IBaseResponse } from '@backend/utilities';
import { BaseMessage } from '@full-stack-project/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CompileCodeResponse<T> extends APISuccessResponse<T> implements IBaseResponse<T> {
    @ApiProperty({
        example: {
            CompilerVersion: 'gcc 11.1',
            CompilationStatus: 'Success',
            ExecutionDetails: {
                Output: 'Hello, World!',
                Errors: null,
                ExecutionTimeInSeconds: 2.5
            }
        },
        description: BaseMessage.SwaggerMessage.Property.Description.Data
    })
    declare Data: T;
}

export class CompileCodeUsingQueueResponse<T>
    extends APISuccessResponse<T>
    implements IBaseResponse<T>
{
    @ApiProperty({
        example: {
            JobId: '87539033'
        },
        description: BaseMessage.SwaggerMessage.Property.Description.Data
    })
    declare Data: T;
}
