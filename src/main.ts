import { NestFactory } from '@nestjs/core';
import { config, DotenvConfigOutput } from 'dotenv';
import { r } from 'rethinkdb-ts';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const results: DotenvConfigOutput = config();
if (results.error) {
  throw new Error(`` + results.error);
}

async function connectDb() {
  console.log('Connecting to database...');
  await r.connectPool({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    db: process.env.DATABASE_NAME,
  }).catch(err => {
    throw new Error(`Something went wrong! ` + err);
  });
  console.log('Connection successful!');
}

async function bootstrap() {
  await connectDb();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.listen(4000);
}
bootstrap();
