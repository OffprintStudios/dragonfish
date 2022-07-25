import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { config, DotenvConfigOutput } from 'dotenv';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import { CORS_OPTIONS } from '$shared/util';
import { SocketRedisAdapter } from './socket-redis.adapter';

/**
 * Determines the location of the required .env file.
 */
const results: DotenvConfigOutput = config({ path: '../../.env' });
if (results.error) {
  Logger.warn(`You don't have a .env file set up! Are you sure the environment variables are configured?`, `Main`);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initializing core functionality and security
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.enableCors(CORS_OPTIONS);
  app.useWebSocketAdapter(new SocketRedisAdapter(app));

  await app.listen(3333);
}
bootstrap();
