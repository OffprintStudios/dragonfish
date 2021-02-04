import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config, DotenvConfigOutput } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import * as csurf from 'csurf';
import * as helmet from 'helmet';

import { AppModule } from './app/app.module';

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
    app.use(cookieParser());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));
    app.use(csurf({ cookie: true }));
    app.use(helmet());
    app.enableCors({ origin: process.env.ORIGIN, credentials: true });
    app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN));

    // this is to make sure the XSRF-TOKEN is being set correctly
    app.use(function (req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return next();
    });

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
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3333;
    await app.listen(port, () => {
        Logger.log('Listening at http://localhost:' + port + '/');
    });
}

bootstrap();
