import { CompileCodeValidator } from '../validators';

export interface ICompilerController {
    compileCode(params: CompileCodeValidator): Promise<ICompileCodeResponse>;
}

export interface ICompilerService {
    compileCode(params: CompileCodeValidator): Promise<ICompileCodeResponse>;
}

export interface ICompileCodeResponse {
    CompilerVersion: string;
    CompilationStatus: string;
    ExecutionDetails: {
        Output: string;
        Errors: string | null;
        ExecutionTimeInSeconds: number;
    };
}
