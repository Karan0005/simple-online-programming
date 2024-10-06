import { CompileCodeValidator } from '../validators';

export interface ICompilerController {
    compileCode(params: CompileCodeValidator): Promise<ICompileCodeResponse>;
    compileCodeUsingQueue(params: CompileCodeValidator): Promise<{ JobId: string }>;
    getCompileJobStatus(jobId: string): Promise<ICompileCodeResponse | undefined>;
}

export interface ICompilerService {
    compileCode(params: CompileCodeValidator): Promise<ICompileCodeResponse>;
}

export interface ICompileCodeResponse {
    CompilerVersion: string;
    CompilationStatus: string;
    ExecutionDetails: {
        Output: string | null;
        Errors: string | null;
        ExecutionTime: string;
    };
}

export interface ICompilerResourceConfig {
    RAM: number;
    CPU: number;
}

export interface IProgrammingLanguageConfig {
    ContainerImage: string;
    SourceCodeFileName: string;
    ExecutableCommand: string;
}
