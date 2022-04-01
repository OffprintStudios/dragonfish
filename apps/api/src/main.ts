import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { config, DotenvConfigOutput } from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import { AppModule } from './app.module';

/**
 * Determines the location of the required .env file.
 */
const results: DotenvConfigOutput = config({ path: '../../.env' });
if (results.error) {
    Logger.warn(
        `You don't have a .env file set up! Are you sure the environment variables are configured?`,
        `Main`,
    );
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Initializing core functionality & security
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://offprint.net',
            /\.offprint\.net$/,
        ],
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    await app.listen(3333);
}
bootstrap();
