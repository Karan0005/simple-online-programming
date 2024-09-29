import { IProgrammingLanguageConfig } from '../interfaces/compile.interface';

export type ConfigFunctionForLanguages = (
    uniqueId: string,
    runTimeInputs: string
) => IProgrammingLanguageConfig;

export type ConfigFunctionWithSourceParsing = (
    uniqueId: string,
    runTimeInputs: string,
    sourceCode: string
) => IProgrammingLanguageConfig;
