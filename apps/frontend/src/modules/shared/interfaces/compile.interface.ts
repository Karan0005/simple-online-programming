export interface ICompileRequest {
    SourceCode: string;
    RunTimeInputs: string;
    ProgrammingLanguage: string;
    ExecutionPower: string;
    TimeOut: number;
}

export interface ICompileResponse {
    Output: string;
}
