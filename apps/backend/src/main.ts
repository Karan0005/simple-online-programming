/* eslint-disable no-console */
import { ExceptionProcessor, ResponseProcessor } from '@backend/utilities';
import { BaseMessage, EnvironmentEnum } from '@full-stack-project/shared';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cluster from 'cluster';
import events from 'events';
import * as express from 'express';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as os from 'os';
import * as winston from 'winston';
import { DependencyChecker, LoggerTransports, setupSecretValues } from './config';
import { DockerService } from './docker/docker.service';
import { AppModule } from './modules/app.module';

async function bootstrap() {
    // Initialize a Winston logger for the application logs
    const appLogger = WinstonModule.createLogger({
        format: winston.format.uncolorize(),
        transports: LoggerTransports
    });

    // Set up environment variables (e.g., API keys or sensitive values)
    await setupSecretValues(appLogger);

    // Create a new NestJS Express application
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bodyParser: true,
        rawBody: true
    });

    // Fetch configuration values for routes and server settings
    const configService = app.get(ConfigService);
    const routePrefix = configService.get('server.routePrefix') || 'api';
    const serverSecret: string = configService.get('server.secret') as string;
    const apiBaseURL: string = configService.get('server.apiBaseURL') as string;

    // Validate required dependencies
    try {
        const dependencyChecker = new DependencyChecker(appLogger, configService);
        await dependencyChecker.verify();
    } catch (error) {
        if (error instanceof Error) {
            appLogger.log(`Error: ${error.message}`);
        } else {
            appLogger.log(`Error: ${String(error)}`);
        }
        process.exit(1);
    }

    // Enable CORS with allowed origins, methods, and headers
    app.enableCors({
        origin: configService.get('server.appBaseURL'),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true
    });

    // Allow URL-encoded data parsing for incoming requests
    app.use(express.urlencoded({ extended: true }));

    // Apply global exception filter and response interceptor
    app.useGlobalFilters(new ExceptionProcessor(appLogger));
    app.useGlobalInterceptors(new ResponseProcessor());

    // Use custom logger for logging across the app
    app.useLogger(appLogger);

    // Set a global route prefix (e.g., '/api')
    app.setGlobalPrefix(routePrefix);

    // Apply global validation with transformation and strict whitelisting
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );

    // Set up basic authentication for accessing Swagger documentation
    app.use(
        ['/' + routePrefix + '/swagger', '/' + routePrefix + '/swagger-json'],
        basicAuth({
            users: {
                developer: serverSecret
            },
            challenge: true
        })
    );

    // Configure Swagger documentation settings
    const options = new DocumentBuilder()
        .setTitle('Backend App')
        .setDescription('API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addServer(apiBaseURL)
        .build();

    // Generate the Swagger document and set up the endpoint
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(routePrefix + '/swagger', app, document);

    // Apply Helmet for security (e.g., XSS prevention, frameguard, HSTS)
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

    // Enable graceful shutdown with NestJS built-in hooks
    app.enableShutdownHooks();

    //Building up docker setup
    try {
        const dockerService = new DockerService(appLogger);
        await dockerService.setupDockerImages();
        appLogger.log('Docker images setup completed successfully.');
    } catch (error: unknown) {
        if (error instanceof Error) {
            appLogger.log(`Error setting up Docker images: ${error.message}`);
        } else {
            appLogger.log(`Error setting up Docker images: ${String(error)}`);
        }
        process.exit(1);
    }

    // Start the server and listen on the configured port
    const port = configService.get('server.port');
    await app.listen(port);
    appLogger.log(BaseMessage.Success.ServerStartUp + port);

    // Return the server and related instances
    return { appLogger, apiBaseURL, routePrefix };
}

if (cluster.default.isPrimary && process.env.APP_ENV !== EnvironmentEnum.LOCAL) {
    // Master process: create worker processes based on CPU count
    const numCPUs = os.cpus().length;
    const workerCount = process.env.WORKER_COUNT ? parseInt(process.env.WORKER_COUNT, 10) : numCPUs;

    // Set the maximum number of listeners for events
    events.EventEmitter.defaultMaxListeners = numCPUs === 1 ? 2 : numCPUs;

    console.log(
        `Master process is running with PID ${process.pid}. Forking ${workerCount} workers...`
    );

    // Fork worker processes for each CPU core
    for (let i = 0; i < workerCount; i++) {
        cluster.default.fork();
    }

    // Restart a worker if it dies unexpectedly
    cluster.default.on('exit', (worker, code, signal) => {
        console.log(
            `Worker ${worker.process.pid} exited with code ${code}, signal ${signal}. Restarting...`
        );
        cluster.default.fork();
    });

    // Graceful shutdown for master process
    process.on('SIGTERM', () => {
        console.log('Master received SIGTERM, shutting down gracefully...');
        for (const id in cluster.default.workers) {
            cluster.default.workers[id]?.kill();
        }
        process.exit(0);
    });

    process.on('SIGINT', () => {
        console.log('Master received SIGINT, shutting down gracefully...');
        for (const id in cluster.default.workers) {
            cluster.default.workers[id]?.kill();
        }
        process.exit(0);
    });
} else {
    // Worker process: start the NestJS app instance
    bootstrap()
        .then(({ appLogger, apiBaseURL, routePrefix }) => {
            appLogger.log(BaseMessage.Success.BackendBootstrap(apiBaseURL + '/' + routePrefix));
        })
        .catch((error) => {
            console.error(JSON.stringify(error));
        });
}
