import dotenv from 'dotenv';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import { EditorFeature, NegatedEditorFeature } from 'monaco-editor/esm/metadata';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import * as webpack from 'webpack';

// Setting environment variables from .env file
dotenv.config({ path: path.resolve(process.env['PWD'] || process.cwd(), '.env') });

// List of languages to include, constrained by EditorLanguage type
const languages: Array<
    | 'cpp'
    | 'csharp'
    | 'java'
    | 'javascript'
    | 'typescript'
    | 'go'
    | 'python'
    | 'kotlin'
    | 'php'
    | 'swift'
    | 'ruby'
    | 'rust'
    | 'perl'
    | 'r'
> = [
    'cpp',
    'csharp',
    'java',
    'javascript',
    'typescript',
    'go',
    'python',
    'kotlin',
    'php',
    'swift',
    'ruby',
    'rust',
    'perl',
    'r'
];

// Define the basic features to include
const features: (EditorFeature | NegatedEditorFeature)[] = [
    'codeEditor',
    'format',
    'find',
    'suggest',
    'snippet',
    'gotoLine',
    'hover',
    'links',
    'wordHighlighter',
    'bracketMatching',
    // Negate features that are not needed
    '!anchorSelect',
    '!bracketMatching',
    '!browser',
    '!caretOperations',
    '!clipboard',
    '!codeAction',
    '!codelens',
    '!colorPicker',
    '!comment',
    '!contextmenu',
    '!cursorUndo',
    '!diffEditor',
    '!diffEditorBreadcrumbs',
    '!dnd',
    '!documentSymbols',
    '!dropOrPasteInto',
    '!folding',
    '!fontZoom',
    '!gotoError',
    '!gotoSymbol',
    '!inPlaceReplace',
    '!indentation',
    '!inlayHints',
    '!inlineCompletions',
    '!inlineEdit',
    '!inlineEdits',
    '!inlineProgress',
    '!inspectTokens',
    '!lineSelection',
    '!linesOperations',
    '!linkedEditing',
    '!longLinesHelper',
    '!multicursor',
    '!parameterHints',
    '!placeholderText',
    '!quickCommand',
    '!quickHelp',
    '!quickOutline',
    '!readOnlyMessage',
    '!referenceSearch',
    '!rename',
    '!sectionHeaders',
    '!semanticTokens',
    '!smartSelect',
    '!stickyScroll',
    '!toggleHighContrast',
    '!toggleTabFocusMode',
    '!tokenization',
    '!unicodeHighlighter',
    '!unusualLineTerminators',
    '!wordOperations',
    '!wordPartOperations'
];

export default (config: webpack.Configuration) => {
    config?.plugins?.push(
        new MonacoWebpackPlugin({
            languages,
            features
        }),
        new webpack.DefinePlugin({
            ngDevMode: 'undefined'
        })
    );

    config?.module?.rules?.push(
        {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }
            ]
        },
        {
            test: /\.ttf$/,
            type: 'asset/resource'
        }
    );

    config.ignoreWarnings = [
        {
            message: /CommonJS or AMD dependencies can cause optimization bailouts/
        }
    ];

    if (process.env['APP_ENV'] === 'PROD') {
        config.optimization = {
            minimize: true,
            minimizer: [new TerserPlugin({ parallel: true })],
            sideEffects: true,
            usedExports: true
        };
    }

    return config;
};
