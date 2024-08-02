/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env['PORT'] || 3000;

  app.setGlobalPrefix(globalPrefix);

  // mock server should be able to handle CORS
  app.enableCors();
  // alow system signal such as SIGTERM
  app.enableShutdownHooks();

  await app.listen(port);
  Logger.log(
    `Mock Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
