import { InjectionType } from '@full-stack-project/shared';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompileController } from './controllers';
import { CompileService } from './services';

@Module({
    imports: [
        BullModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                connection: {
                    host: configService.get('redis.host'),
                    port: configService.get('redis.port')
                }
            }),
            inject: [ConfigService]
        }),
        BullModule.registerQueue({
            name: 'compile'
        })
    ],
    controllers: [CompileController],
    providers: [
        {
            provide: InjectionType.CompilerService,
            useClass: CompileService
        }
    ]
})
export class CompilerModule {}
