import { BaseMessage } from '@full-stack-project/shared';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Inject,
    Logger,
    LoggerService
} from '@nestjs/common';
import { Response } from 'express';
import { IBaseResponse } from '../interfaces';
@Catch()
export class ExceptionProcessor implements ExceptionFilter {
    private status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    constructor(@Inject(Logger) private readonly logger: LoggerService) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const responseModel: IBaseResponse<null> = {
            IsSuccess: false,
            Message: BaseMessage.Error.BackendGeneral,
            Data: null,
            Errors: []
        };

        if (exception instanceof HttpException) {
            this.status = exception.getStatus();
            responseModel.Message = exception.message
                ? exception.message
                : BaseMessage.Error.BackendGeneral;
            responseModel.Errors = [
                {
                    Exception: exception.getResponse()
                }
            ];
        } else {
            this.status = HttpStatus.INTERNAL_SERVER_ERROR;
            responseModel.Message = BaseMessage.Error.BackendGeneral;
            responseModel.Errors = [
                {
                    Exception: exception
                }
            ];
        }

        if (
            responseModel.Message !== BaseMessage.Error.RouteNotFound &&
            this.status !== HttpStatus.UNAUTHORIZED
        ) {
            this.logger.error(exception);
        }
        response.status(this.status).json(responseModel);
    }
}
