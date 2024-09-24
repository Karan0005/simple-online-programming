import { BaseMessage } from '@full-stack-project/shared';
import { BadRequestException } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';

export const NumberTransformProcessor = (params: TransformFnParams) => {
    try {
        return parseInt(params.value);
    } catch (error) {
        throw new BadRequestException(BaseMessage.Error.InvalidNumber);
    }
};
