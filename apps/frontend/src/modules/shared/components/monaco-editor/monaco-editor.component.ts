import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

@Component({
    selector: 'app-monaco-editor',
    templateUrl: './monaco-editor.component.html',
    styleUrl: './monaco-editor.component.scss'
})
export class MonacoEditorComponent implements AfterViewInit, OnChanges {
    @Input() value = '';
    @Input() language = 'JavaScript';
    @Input() theme = 'dark';
    @Output() valueChange = new EventEmitter<string>();
    private editor: monaco.editor.IStandaloneCodeEditor | undefined;

    private languageMapping: { [key: string]: string } = {
        JavaScript: 'javascript',
        TypeScript: 'typescript',
        CPP: 'cpp',
        C: 'c',
        Java: 'java',
        Kotlin: 'kotlin',
        Python: 'python',
        Go: 'go',
        PHP: 'php',
        'C#': 'csharp',
        Swift: 'swift',
        R: 'r',
        Ruby: 'ruby',
        Rust: 'rust',
        Perl: 'perl'
    };

    private defaultPrograms: { [key: string]: string } = {
        javascript: `console.log('Hello, world!');`,
        typescript: `console.log('Hello, world!');`,
        cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}`,
        c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, world!\\n");\n    return 0;\n}`,
        java: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}`,
        kotlin: `fun main() {\n    println("Hello, world!")\n}`,
        python: `print('Hello, world!')`,
        go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, world!")\n}`,
        php: `<?php\n    echo 'Hello, world!';\n?>`,
        csharp: `using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello, world!");\n    }\n}`,
        swift: `print("Hello, world!")`,
        r: `cat("Hello, world!")`,
        ruby: `puts 'Hello, world!'`,
        rust: `fn main() {\n    println!("Hello, world!");\n}`,
        perl: `print "Hello, world!\n";`
    };

    private themeMapping: { [key: string]: string } = {
        dark: 'vs-dark',
        light: 'vs'
    };

    ngAfterViewInit(): void {
        this.initializeEditor();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.editor) {
            if (changes['language'] && !changes['language'].isFirstChange()) {
                const newLanguage = this.languageMapping[this.language];
                const model = this.editor.getModel();
                if (newLanguage && model) {
                    monaco.editor.setModelLanguage(model, newLanguage);
                    this.editor.setValue(this.defaultPrograms[newLanguage] || '');
                }
            }
            if (changes['theme'] && !changes['theme'].isFirstChange()) {
                const newTheme = this.themeMapping[this.theme];
                if (newTheme) {
                    monaco.editor.setTheme(newTheme);
                }
            }
        }
    }

    private initializeEditor(): void {
        const initialLanguage = this.languageMapping[this.language] || 'javascript';
        const initialTheme = this.themeMapping[this.theme] || 'vs-dark';

        this.editor = monaco.editor.create(document.getElementById('editorContainer')!, {
            value: this.defaultPrograms[initialLanguage] || '',
            language: initialLanguage,
            theme: initialTheme,
            minimap: {
                enabled: false // Disable the minimap
            },
            lineNumbers: 'on',
            wordWrap: 'on', // Optional, manage text flow,
            smoothScrolling: true
        });

        this.editor.onDidChangeModelContent(() => {
            this.valueChange.emit(this.editor!.getValue());
        });
    }
}
