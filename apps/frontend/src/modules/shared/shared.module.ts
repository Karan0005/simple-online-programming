import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RestApiService } from './services';

@NgModule({
    declarations: [PageNotFoundComponent, LandingPageComponent, MonacoEditorComponent],
    imports: [
        CommonModule,
        FormsModule,
        ToastrModule.forRoot({
            preventDuplicates: true
        })
    ],
    providers: [provideHttpClient(), RestApiService]
})
export class SharedModule {}
