import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { BaseMessage, IBaseResponse } from '@full-stack-project/shared';
import { ApiRoute } from '../../constants';
import { ICompileRequest, ICompileResponse } from '../../interfaces';
import { RestApiService } from '../../services';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
    languages: { img: string; value: string; code: string }[] = [
        { img: 'javascript.svg', value: 'JavaScript', code: `console.log('Hello, world!');` },
        {
            img: 'typescript.svg',
            value: 'TypeScript',
            code: `console.log('Hello, world!');`
        },
        {
            img: 'cpp.svg',
            value: 'CPP',
            code: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}`
        },
        {
            img: 'c.svg',
            value: 'C',
            code: `#include <stdio.h>\n\nint main() {\n    printf("Hello, world!\\n");\n    return 0;\n}`
        },
        {
            img: 'java.svg',
            value: 'Java',
            code: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}`
        },
        {
            img: 'kotlin.svg',
            value: 'Kotlin',
            code: `fun main() {\n    println("Hello, world!")\n}`
        },
        { img: 'python.svg', value: 'Python', code: `print('Hello, world!')` },
        {
            img: 'go.svg',
            value: 'Go',
            code: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, world!")\n}`
        },
        { img: 'php.svg', value: 'PHP', code: `<?php\n    echo 'Hello, world!';\n?>` },
        {
            img: 'csharp.svg',
            value: 'CSharp',
            code: `using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello, world!");\n    }\n}`
        },
        { img: 'swift.svg', value: 'Swift', code: `print("Hello, world!")` },
        { img: 'r.svg', value: 'R', code: `cat("Hello, world!")` },
        { img: 'ruby.svg', value: 'Ruby', code: `puts 'Hello, world!'` },
        { img: 'rust.svg', value: 'Rust', code: `fn main() {\n    println!("Hello, world!");\n}` },
        { img: 'perl.svg', value: 'Perl', code: `print "Hello, world!";` }
    ];
    selectedLanguage: { img: string; value: string; code: string } = {
        img: this.languages[0].img,
        value: this.languages[0].value,
        code: this.languages[0].code
    };
    executionPowers: string[] = ['low', 'medium', 'high', 'extreme'];
    timeouts: { value: number; label: string }[] = [
        { value: 10, label: '10 Seconds' },
        { value: 30, label: '30 Seconds' },
        { value: 60, label: '60 Seconds' }
    ];
    compileRequest: ICompileRequest = {
        SourceCode: this.languages[0].code,
        RunTimeInput: '',
        ProgrammingLanguage: this.languages[0].value,
        ExecutionPower: this.executionPowers[0],
        TimeOut: this.timeouts[0].value
    };
    compileResult = '';

    selectedTheme = 'light';
    dropdownOpen = false;

    // ViewChild to target dropdown
    @ViewChild('dropdownMenu', { static: false }) dropdownMenu!: ElementRef;

    constructor(private readonly apiService: RestApiService) {}

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
    }

    selectLanguage(language: { img: string; value: string; code: string }) {
        this.selectedLanguage = language;
        this.compileRequest.ProgrammingLanguage = language.value;
        this.compileRequest.ExecutionPower = this.executionPowers[0];
        this.compileRequest.TimeOut = this.timeouts[0].value;
        this.compileRequest.RunTimeInput = '';
        this.compileResult = '';
        this.dropdownOpen = false;
    }

    @HostListener('document:click', ['$event'])
    clickOutside(event: MouseEvent) {
        if (this.dropdownMenu && !this.dropdownMenu.nativeElement.contains(event.target)) {
            this.dropdownOpen = false;
        }
    }

    onEditorChange(value: string): void {
        this.compileRequest.SourceCode = value;
    }

    toggleTheme() {
        document.body.classList.toggle('dark');
        this.selectedTheme = this.selectedTheme === 'dark' ? 'light' : 'dark';
    }

    async compile(): Promise<void> {
        this.compileResult = 'Compiling...';

        try {
            this.compileRequest.TimeOut = +this.compileRequest.TimeOut;
            const response: IBaseResponse<ICompileResponse> = await this.apiService.post<
                ICompileRequest,
                IBaseResponse<ICompileResponse>
            >(ApiRoute.Compiler.V1.Compile, this.compileRequest);

            this.compileResult =
                (response.Data.ExecutionDetails.Output ??
                    response.Data.ExecutionDetails.Errors ??
                    response.Message) ||
                BaseMessage.Error.SomethingWentWrong;
        } catch (error) {
            this.compileResult = (
                (error as HttpErrorResponse).error as IBaseResponse<null>
            ).Message;
        }
    }
}
