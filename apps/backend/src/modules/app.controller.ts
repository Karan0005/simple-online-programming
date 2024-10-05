import { ControllerExceptionProcessor, HealthCheckSuccessResponse } from '@backend/utilities';
import { BaseMessage } from '@full-stack-project/shared';
import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IRootRouteResponse } from './app.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @ApiExcludeEndpoint()
    async rootRoute(): Promise<IRootRouteResponse> {
        try {
            return this.appService.rootRoute();
        } catch (error) {
            throw ControllerExceptionProcessor(error);
        }
    }

    @Get('health')
    @ApiOperation({ summary: 'Health Route.' })
    @ApiResponse({
        status: BaseMessage.SwaggerMessage.Response.Ok.Status,
        description: BaseMessage.SwaggerMessage.Response.Ok.Description,
        type: HealthCheckSuccessResponse
    })
    async checkHealth() {
        try {
            return await this.appService.checkHealth();
        } catch (error) {
            throw ControllerExceptionProcessor(error);
        }
    }
}
