import { BaseMessage } from '@full-stack-project/shared';
import { BadRequestException } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';
import moment from 'moment';

export const DateTimeTransformProcessor = (params: TransformFnParams): Date => {
    try {
        const isValid: boolean = moment
            .utc(params.value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true)
            .isValid();
        if (!isValid || moment.parseZone(params.value).utcOffset() !== 0) {
            throw new BadRequestException(BaseMessage.Error.InvalidDateTimeFormat);
        }

        return params.value;
    } catch (error) {
        throw new BadRequestException(BaseMessage.Error.InvalidDateTimeFormat);
    }
};

export const DateTransformProcessor = (params: TransformFnParams): string => {
    try {
        const isValid: boolean = moment(params.value, 'YYYY-MM-DD', true).isValid();
        if (!isValid) {
            throw new BadRequestException(BaseMessage.Error.InvalidDateFormat);
        }

        return params.value;
    } catch (error) {
        throw new BadRequestException(BaseMessage.Error.InvalidDateFormat);
    }
};
