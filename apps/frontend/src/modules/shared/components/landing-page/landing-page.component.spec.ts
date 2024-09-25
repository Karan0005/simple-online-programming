import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RestApiService } from '../../services';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
    let component: LandingPageComponent;
    let fixture: ComponentFixture<LandingPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, FormsModule],
            declarations: [LandingPageComponent, MonacoEditorComponent],
            providers: [provideHttpClient(), RestApiService]
        }).compileComponents();

        fixture = TestBed.createComponent(LandingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
