import { Module } from '@nestjs/common';
import dataSource from './database/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';

// import { BullBoard } from '@bull-board/express';
// import { BullAdapter } from '@bull-board/express';
import authConfig from 'config/auth.config';
import { MailerModule } from '@nestjs-modules/mailer';
import express from 'express';
import { EmailModule } from './modules/email/email.module';
import QueueService from './modules/email/queue.service';

import { BullBoardModule } from "@bull-board/nestjs";
import { ExpressAdapter } from "@bull-board/express";


@Module({
  imports: [

    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development'], // Specify custom .env files (optional)
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,
      }),
      dataSourceFactory: async () => dataSource,
    }),
    
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log('SMTP Config:', {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          user: configService.get<string>('SMTP_USER'),
          pass: configService.get<string>('SMTP_PASSWORD'),
        }); 

        return {
          transport: {
            host: configService.get<string>('SMTP_HOST'),
            port: configService.get<number>('SMTP_PORT'),
            auth: {
              user: configService.get<string>('SMTP_USER'),
              pass: configService.get<string>('SMTP_PASSWORD'),
            },
          },
          defaults: {
            from: `"Team Remote Bingo" <${configService.get<string>('SMTP_USERPR')}>`,
          },
          template: {
            dir: process.cwd() + '/src/modules/email/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),

    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: authConfig().redis.host,
          port: +authConfig().redis.port,
          password: authConfig().redis.password,
          username: authConfig().redis.username,
        },
      }),
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter
    }),

    AuthModule, 
    UserModule, 
    PostModule,
    EmailModule, 
    CommentModule],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    QueueService
  ],
})
export class AppModule {
  constructor() {}
}
