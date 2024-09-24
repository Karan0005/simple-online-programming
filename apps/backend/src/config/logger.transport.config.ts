import { utilities } from 'nest-winston';
import * as winston from 'winston';
import * as TransportStream from 'winston-transport';

/**
 * This is just using console for logs, recommended approach is to use cloud logs like azure app insights, aws cloud watch.
 * For cloud logs you just need to push required new winston transport object in the below LoggerTransports array
 */

export const LoggerTransports: TransportStream[] = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike('App', { prettyPrint: true })
        )
    })
];
