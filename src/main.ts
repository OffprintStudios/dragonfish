import { NestFactory } from '@nestjs/core';
import { config, DotenvConfigOutput } from 'dotenv';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const results: DotenvConfigOutput = config();
if (results.error) {
  throw new Error(`` + results.error);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.listen(8000);
}
bootstrap();
