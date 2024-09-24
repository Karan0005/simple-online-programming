import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import { EditorFeature, NegatedEditorFeature } from 'monaco-editor/esm/metadata';
import * as webpack from 'webpack';

// Define the Rule interface based on your actual configuration structure
interface Rule {
    test?: RegExp; // Adjust this according to your actual rule structure
}

// Type guard to check if the value is a Rule
function isRule(value: unknown): value is Rule {
    return typeof value === 'object' && value !== null && 'test' in value;
}

// Define a type that extends StatsOptions to include warningsFilter
interface CustomStatsOptions extends webpack.StatsOptions {
    warningsFilter?: RegExp[];
}

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

    // Find the index of the CSS rule using the defined Rule type and type guard
    const cssRuleIdx: number | undefined = config?.module?.rules
        ?.filter(isRule) // Filter out invalid values
        .findIndex((rule) => rule.test?.toString().includes(':css'));

    // Check if cssRuleIdx is valid and not -1
    if (cssRuleIdx !== undefined && cssRuleIdx !== -1) {
        // Ensure rules is defined before splicing
        config.module?.rules?.splice(cssRuleIdx, 1);
    }

    config?.module?.rules?.push(
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]',
                        outputPath: 'assets/fonts/',
                        publicPath: 'assets/fonts/'
                    }
                }
            ]
        }
    );

    // Suppress CommonJS warnings
    config.stats = config.stats || {};

    // Type assertion to extend the config.stats type
    (config.stats as CustomStatsOptions).warningsFilter = [
        /end value has mixed support/,
        /CommonJS or AMD dependencies can cause optimization bailouts/
    ];

    config.optimization = {
        minimize: true
    };

    return config;
};
