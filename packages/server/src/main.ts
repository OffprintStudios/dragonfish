import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config, DotenvConfigOutput } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';

import { AppModule } from './app/app.module';

/**
 * Determines the location of the required .env file.
 */
const results: DotenvConfigOutput = config();
if (results.error) {
  throw new Error(`Couldn't find the .env file!`);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(json({limit: '50mb'}));
  app.use(urlencoded({limit: '50mb', extended: true}));
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/');
  });
}

bootstrap();
