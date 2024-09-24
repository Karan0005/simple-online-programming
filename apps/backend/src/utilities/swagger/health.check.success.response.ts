import { BaseMessage } from '@full-stack-project/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IBaseResponse } from '../interfaces';
import { APISuccessResponse } from './api.success.response';

export class HealthCheckSuccessResponse<T>
    extends APISuccessResponse<T>
    implements IBaseResponse<T>
{
    @ApiProperty({
        example: {
            status: 'ok',
            info: {
                'HEAP Memory': {
                    status: 'up'
                },
                'RSS Memory': {
                    status: 'up'
                },
                'DISK Health': {
                    status: 'up'
                }
            },
            error: {},
            details: {
                'HEAP Memory': {
                    status: 'up'
                },
                'RSS Memory': {
                    status: 'up'
                },
                'DISK Health': {
                    status: 'up'
                }
            }
        },
        description: BaseMessage.SwaggerMessage.Property.Description.Data
    })
    Data: T = {} as T;
}
