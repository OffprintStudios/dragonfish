import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config, DotenvConfigOutput } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import * as csurf from 'csurf';
import * as helmet from 'helmet';

import { AppModule } from './app/app.module';
import { DragonfishTags } from '@dragonfish/models/util';

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
    app.use(csurf({ cookie: { sameSite: 'none', secure: true } }));
    // this is to make sure the XSRF-TOKEN is being set correctly
    app.use(function (req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken(), { sameSite: 'none', secure: true });
        return next();
    });
    app.use(helmet());
    app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN));
    app.setGlobalPrefix('api');

    // Set up Swagger
    const config = new DocumentBuilder()
        .setTitle(`Dragonfish`)
        .setDescription(`"Fire in its own way"&mdash;The official Offprint API.`)
        .setVersion(`1.0`)
        .addTag(DragonfishTags.Auth)
        .addTag(DragonfishTags.Users)
        .addTag(DragonfishTags.Content)
        .addTag(DragonfishTags.Collections)
        .addTag(DragonfishTags.Comments)
        .addTag(DragonfishTags.History)
        .addTag(DragonfishTags.Messages)
        .addTag(DragonfishTags.Meta)
        .addTag(DragonfishTags.ApprovalQueue)
        .addTag(DragonfishTags.Search)
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3333;
    await app.listen(port, () => {
        Logger.log('Listening at http://localhost:' + port + '/');
    });
}

bootstrap();
