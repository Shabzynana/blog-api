import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { initializeDataSource } from './database/data-source';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  const dataSource = app.get(DataSource);

  app.useLogger(logger);


  try {
    await initializeDataSource();
    logger.log('Data Source has been initialized!');
  } catch (err) {
    logger.log('Error during Data Source initialization', err);
    process.exit(1);
  }

  const config = new DocumentBuilder()
    .setTitle('BLOG')
    .setDescription('Blog API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://127.0.0.1:${process.env.PORT}/`)
    .addServer(`https://blog-api-46bi.onrender.com/`)
    .build();
  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3002);


}

bootstrap();
