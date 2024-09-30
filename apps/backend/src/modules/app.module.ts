import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { environment } from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompilerModule } from './compiler/compiler.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            ignoreEnvFile: true,
            load: [environment]
        }),
        TerminusModule,
        CompilerModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
