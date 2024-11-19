import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { initializeDataSource } from './database/data-source';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  const dataSource = app.get(DataSource);

  try {
    await initializeDataSource();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization', err);
    process.exit(1);
  }

  const config = new DocumentBuilder()
    .setTitle('BLOG')
    .setDescription('Blog API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://127.0.0.1:${process.env.PORT}/`)
    .build();
  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3002);


}

bootstrap();
