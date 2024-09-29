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
    @Input() language = '';
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
        CSharp: 'csharp',
        Swift: 'swift',
        R: 'r',
        Ruby: 'ruby',
        Rust: 'rust',
        Perl: 'perl'
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
                    this.editor.setValue(this.value || '');
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
        const editorContainer = document.getElementById('editorContainer');

        if (editorContainer) {
            this.editor = monaco.editor.create(editorContainer, {
                value: this.value || '',
                language: initialLanguage,
                theme: initialTheme,
                minimap: {
                    enabled: false
                },
                lineNumbers: 'on',
                wordWrap: 'on',
                smoothScrolling: true
            });

            this.editor.onDidChangeModelContent(() => {
                if (this.editor) {
                    this.valueChange.emit(this.editor.getValue());
                }
            });
        }
    }
}
