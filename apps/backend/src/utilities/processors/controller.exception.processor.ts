import { HttpException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

export const ControllerExceptionProcessor = (
    error: unknown
): HttpException | InternalServerErrorException => {
    try {
        if (error instanceof HttpException || error instanceof UnauthorizedException) {
            return error;
        }
        return new InternalServerErrorException(error);
    } catch (error) {
        return new InternalServerErrorException(error);
    }
};
