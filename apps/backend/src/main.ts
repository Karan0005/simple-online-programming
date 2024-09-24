/* eslint-disable no-console */
import { BaseMessage } from '@full-stack-project/shared';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerTransports, setupSecretValues } from './config';
import { AppModule } from './modules/app.module';
import { ExceptionProcessor, ResponseProcessor } from './utilities';

async function bootstrap() {
    //Setting Up Logger
    const appLogger = WinstonModule.createLogger({
        format: winston.format.uncolorize(),
        transports: LoggerTransports
    });

    //Setting Up Environment Variables
    await setupSecretValues(appLogger);
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bodyParser: true,
        rawBody: true
    });
    const configService = app.get(ConfigService);
    const routePrefix = configService.get('server.routePrefix') || 'api';

    // Setting Up Application Helmet Policy Security
    /**
     * This header helps prevent cross-site scripting (XSS) attacks by restricting the resources that can be loaded by the application
     * Helps prevent click jacking attacks by restricting the application from being embedded in a frame
     * This header helps prevent attackers from learning the technology stack used by the application
     * This header helps prevent man-in-the-middle (MITM) attacks by enforcing the use of HTTPS
     * This header helps prevent attackers from exploiting MIME type sniffing vulnerabilities by preventing browsers from guessing the content type
     * sets the X-XSS-Protection header to enable the browser's cross-site scripting (XSS) filter
     * This will control the amount of information sent in the "Referer" header, which can help protect against some types of attacks.
     *
     */
    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'default-src': ["'none'"],
                    'script-src': ["'self'"],
                    'style-src': ["'self'", "'unsafe-inline'"],
                    'img-src': ["'self'", 'data:'],
                    'font-src': ["'self'"],
                    'connect-src': ["'self'"],
                    'media-src': ["'self'"],
                    'object-src': ["'none'"],
                    'base-uri': ["'self'"],
                    'form-action': ["'self'"],
                    'frame-ancestors': ["'none'"],
                    'upgrade-insecure-requests': [],
                    'block-all-mixed-content': [],
                    sandbox: ['allow-scripts', 'allow-same-origin']
                }
            },
            frameguard: { action: 'deny' },
            hidePoweredBy: true,
            hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
            noSniff: true,
            xssFilter: true,
            referrerPolicy: { policy: 'same-origin' },
            crossOriginEmbedderPolicy: true,
            crossOriginOpenerPolicy: { policy: 'same-origin' }
        })
    );

    // Setting Up CORS Policy Security
    app.enableCors({
        origin: configService.get('server.appBaseURL'),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true
    });

    // Setting Up URL Policy Security
    app.use(express.urlencoded({ extended: true }));

    //Setting Up Middleware
    app.useGlobalFilters(new ExceptionProcessor(appLogger));
    app.useGlobalInterceptors(new ResponseProcessor());
    app.useLogger(appLogger);
    app.setGlobalPrefix(routePrefix);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );

    //Setting Up Swagger Documentation
    const options = new DocumentBuilder()
        .setTitle('Backend App')
        .setDescription('API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(routePrefix + '/swagger', app, document);

    //Initiating Server
    const port = configService.get('server.port');
    await app.listen(port);
    appLogger.log(BaseMessage.Success.ServerStartUp + port);
    return { appLogger, configService, routePrefix };
}

bootstrap()
    .then(({ appLogger, configService, routePrefix }) => {
        const apiBaseURL: string = configService.get('server.apiBaseURL') as string;
        appLogger.log(BaseMessage.Success.BackendBootstrap(apiBaseURL + '/' + routePrefix));
    })
    .catch((error) => {
        console.error(JSON.stringify(error));
    });
