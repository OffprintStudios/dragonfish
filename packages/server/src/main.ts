import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config, DotenvConfigOutput } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import * as csurf from 'csurf';
import * as helmet from 'helmet';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

/**
 * Determines the location of the required .env file.
 */
const results: DotenvConfigOutput = config();
if (results.error) {
    Logger.warn(`You don't have a .env file set up! Are you sure the environment variables are configured?`, `Main`);
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Initializing core functionality & security
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));
    app.enableCors({
        origin: process.env.ORIGIN,
        credentials: true,
        allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'Origin'],
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        optionsSuccessStatus: 204,
    });
    if (process.env.NODE_ENV === 'production') {
        app.use(csurf({ cookie: { sameSite: 'none', secure: true } }));
        // this is to make sure the XSRF-TOKEN is being set correctly
        app.use(function (req, res, next) {
            res.cookie('XSRF-TOKEN', req.csrfToken(), { sameSite: 'none', secure: true });
            return next();
        });
    }
    app.use(helmet());
    app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN));
    app.setGlobalPrefix('api');

    // Set up Swagger
    const config = new DocumentBuilder()
        .setTitle(`Dragonfish`)
        .setDescription(`"Fire in its own way"--The official Offprint API.`)
        .setVersion(`1.0`)
        .addTag(`auth`)
        .addTag(`user`)
        .addTag(`content`)
        .addTag(`search`)
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    const port = process.env.PORT || 3333;
    await app.listen(port, () => {
        Logger.log('Listening at http://localhost:' + port + '/');
    });
}

bootstrap();
