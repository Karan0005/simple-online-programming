export interface ICompileRequest {
    SourceCode: string;
    RunTimeInput: string;
    ProgrammingLanguage: string;
    ExecutionPower: string;
    TimeOut: number;
}

export interface ICompileResponse {
    CompilerVersion: string;
    CompilationStatus: string;
    ExecutionDetails: {
        Output: string | null;
        Errors: string | null;
        ExecutionTime: string;
    };
}
