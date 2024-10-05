import { Component, OnInit } from '@angular/core';
import { BaseMessage, IBaseResponse } from '@full-stack-project/shared';
import { NGXLogger } from 'ngx-logger';
import { CONFIG } from '../config/config';
import { ApiRoute } from './shared/constants';
import { RestApiService } from './shared/services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    constructor(
        private readonly loggerService: NGXLogger,
        private readonly restAPIService: RestApiService
    ) {}

    async ngOnInit(): Promise<void> {
        this.loggerService.info(
            `Frontend application starts successfully for ${CONFIG.environment} environment`
        );

        const response: IBaseResponse<{ Information: string }> = await this.restAPIService.get<
            IBaseResponse<{ Information: string }>
        >(ApiRoute.Base.RootRoute);

        if (response.IsSuccess) {
            this.loggerService.info(response.Data.Information);
        } else {
            this.loggerService.error(BaseMessage.Error.SomethingWentWrong);
        }
    }
}
