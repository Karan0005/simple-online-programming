import { InjectionType } from '@full-stack-project/shared';
import { Module } from '@nestjs/common';
import { CompileController } from './controllers';
import { CompileService } from './services';

@Module({
    controllers: [CompileController],
    providers: [
        {
            provide: InjectionType.CompilerService,
            useClass: CompileService
        }
    ]
})
export class CompilerModule {}
