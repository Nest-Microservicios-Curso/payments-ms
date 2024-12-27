import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Payments MS');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(envs.port);
  logger.verbose(`Running on port ${envs.port}`);
}
bootstrap();
