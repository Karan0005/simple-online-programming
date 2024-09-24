import { BaseMessage } from '@full-stack-project/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IBaseResponse } from '../interfaces';

export class APISuccessResponse<T> implements IBaseResponse<T> {
    @ApiProperty({
        example: true,
        description: BaseMessage.SwaggerMessage.Property.Description.IsSuccess
    })
    IsSuccess!: boolean;

    @ApiProperty({
        example: BaseMessage.Success.SuccessGeneral,
        description: BaseMessage.SwaggerMessage.Property.Description.Message
    })
    Message!: string;

    Data!: T;

    @ApiProperty({
        example: [],
        description: BaseMessage.SwaggerMessage.Property.Description.Errors
    })
    Errors!: unknown[];
}
