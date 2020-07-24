import { NestFactory } from '@nestjs/core';
import { config, DotenvConfigOutput } from 'dotenv';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const results: DotenvConfigOutput = config();
if (process.env.NODE_ENV === 'development') {
  if (results.error) {
    throw new Error(`You don't have the .env file set up!` + results.error);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
