import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailService } from './email.service';
import QueueService from './queue.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { EmailController } from './email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entites/user.entity';
import EmailQueueConsumer from './email.consumer';

import { BullBoardModule } from "@bull-board/nestjs";
import { BullAdapter } from "@bull-board/api/bullAdapter";



@Module({
  providers: [EmailService, QueueService, EmailQueueConsumer],
  exports: [EmailService, QueueService, BullModule],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueueAsync({
      name: 'emailSending',
    }),
    BullBoardModule.forFeature({
      name: 'emailSending',
      adapter: BullAdapter, 
    }),
   
  ],
  // controllers: [EmailController],
})
export class EmailModule {}
