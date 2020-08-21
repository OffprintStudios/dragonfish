import { NestFactory } from '@nestjs/core';
import { config, DotenvConfigOutput } from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as path from 'path';

import { AppModule } from './app.module';

let results: DotenvConfigOutput = config({path: path.resolve(__dirname, '..', '.env')});
if (results.error) {
  // Try once more in the path above _that_
  results = config({path: path.resolve(__dirname, '..', '..', '.env')});
  if (results.error) {
    throw new Error(`You don't have the .env file set up!` + results.error);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  await app.listen(3000);
}
bootstrap();
