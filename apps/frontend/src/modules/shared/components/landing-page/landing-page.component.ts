import { Component, ElementRef, HostListener } from '@angular/core';
import { IBaseResponse } from '@full-stack-project/shared';
import { ApiRoute } from '../../constants';
import { ICompileRequest, ICompileResponse } from '../../interfaces';
import { RestApiService } from '../../services';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
    selectedLanguage: { img: string; value: string } = {
        img: 'javascript.svg',
        value: 'JavaScript'
    };
    executionPower = 'medium';
    selectedTimeout = 20;
    runTimeInputs = '';
    stdoutOutput = '';
    themeIcon = '🌙';
    selectedTheme = 'light';
    languages: { img: string; value: string }[] = [
        { img: 'javascript.svg', value: 'JavaScript' },
        { img: 'typescript.svg', value: 'TypeScript' },
        { img: 'cpp.svg', value: 'CPP' },
        { img: 'c.svg', value: 'C' },
        { img: 'java.svg', value: 'Java' },
        { img: 'kotlin.svg', value: 'Kotlin' },
        { img: 'python.svg', value: 'Python' },
        { img: 'go.svg', value: 'Go' },
        { img: 'php.svg', value: 'PHP' },
        { img: 'csharp.svg', value: 'C#' },
        { img: 'swift.svg', value: 'Swift' },
        { img: 'r.svg', value: 'R' },
        { img: 'ruby.svg', value: 'Ruby' },
        { img: 'rust.svg', value: 'Rust' },
        { img: 'perl.svg', value: 'Perl' }
    ];
    executionPowers: string[] = ['low', 'medium', 'high', 'extreme'];
    timeouts: { value: number; label: string }[] = [
        { value: 10, label: '10 Seconds' },
        { value: 20, label: '20 Seconds' },
        { value: 60, label: '60 Seconds' }
    ];
    sourceCode = '';
    dropdownOpen = false;

    constructor(private apiService: RestApiService, private elementReference: ElementRef) {}

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
    }

    selectLanguage(language: { img: string; value: string }) {
        this.selectedLanguage = language;
        this.dropdownOpen = false;
    }

    @HostListener('document:click', ['$event'])
    clickOutside(event: MouseEvent) {
        if (!this.elementReference.nativeElement.contains(event.target)) {
            this.dropdownOpen = false; // Close the dropdown if clicked outside
        }
    }
    toggleTheme() {
        this.selectedTheme = this.selectedTheme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark-theme');
        this.themeIcon = this.themeIcon === '🌙' ? '☀️' : '🌙';
    }

    onEditorChange(value: string): void {
        this.sourceCode = value;
    }

    async compileAndRun(): Promise<void> {
        const payload: ICompileRequest = {
            SourceCode: this.sourceCode,
            RunTimeInputs: this.runTimeInputs,
            ProgrammingLanguage: this.selectedLanguage.value,
            ExecutionPower: this.executionPower,
            TimeOut: this.selectedTimeout
        };
        this.stdoutOutput = 'Compiling...';
        const response: IBaseResponse<ICompileResponse> = await this.apiService.post<
            ICompileRequest,
            IBaseResponse<{ Output: string }>
        >(ApiRoute.Compiler.V1.Compile, payload);

        this.stdoutOutput = response.Data.Output || response.Message || 'Unknown error occurred';
    }

    // Method to toggle the dark theme
    onThemeToggle(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            document.body.classList.add('dark'); // Add dark class if checked
            this.selectedTheme = 'dark';
        } else {
            document.body.classList.remove('dark'); // Remove dark class if not checked
            this.selectedTheme = 'light';
        }
    }
}
