import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ToastrModule } from 'ngx-toastr';
import { CONFIG } from '../../config/config';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RestApiService } from './services';

@NgModule({
    declarations: [PageNotFoundComponent, LandingPageComponent, MonacoEditorComponent],
    imports: [
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            preventDuplicates: true
        }),
        LoggerModule.forRoot({
            level: CONFIG.logLevel === 'debug' ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.ERROR
        })
    ],
    providers: [provideHttpClient(), RestApiService]
})
export class SharedModule {}
