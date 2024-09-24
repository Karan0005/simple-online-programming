import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { CONFIG } from '../config/config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        SharedModule,
        BrowserModule,
        AppRoutingModule,
        LoggerModule.forRoot({
            level: CONFIG.logLevel === 'debug' ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.ERROR
        })
    ],
    providers: [provideHttpClient()],
    bootstrap: [AppComponent]
})
export class AppModule {}
