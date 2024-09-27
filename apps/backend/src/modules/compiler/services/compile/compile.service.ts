import { Injectable } from '@nestjs/common';
import { ICompileCodeResponse, ICompilerService } from '../../interfaces';
import { CompileCodeValidator } from '../../validators';

@Injectable()
export class CompileService implements ICompilerService {
    async compileCode(params: CompileCodeValidator): Promise<ICompileCodeResponse> {
        // eslint-disable-next-line no-console
        console.log(params);
        return {
            CompilerVersion: 'gcc 11.1',
            CompilationStatus: 'Success',
            ExecutionDetails: {
                Output: 'Hello, World!',
                Errors: null,
                ExecutionTimeInSeconds: 2.5
            }
        };
    }
}
