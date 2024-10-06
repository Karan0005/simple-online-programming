import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { InjectionType } from '@full-stack-project/shared';
import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import basicAuth from 'express-basic-auth';
import { CompileController } from './controllers';
import { CompileQueueService, CompileService } from './services';

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
            name: InjectionType.CompileQueueService
        }),
        BullBoardModule.forRoot({
            route: '/queues',
            adapter: ExpressAdapter
        }),
        BullBoardModule.forFeature({
            name: InjectionType.CompileQueueService,
            adapter: BullMQAdapter
        })
    ],
    controllers: [CompileController],
    providers: [
        {
            provide: InjectionType.CompilerService,
            useClass: CompileService
        },
        CompileQueueService
    ]
})
export class CompilerModule {
    constructor(private readonly configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        const serverSecret: string = this.configService.get('server.secret') as string;

        consumer
            .apply(
                basicAuth({
                    users: { developer: serverSecret },
                    challenge: true,
                    realm: 'Bull Board'
                })
            )
            .forRoutes('/queues');
    }
}
