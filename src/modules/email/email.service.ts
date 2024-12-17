import { HttpStatus, Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import * as Handlebars from 'handlebars';
import { MailerService } from '@nestjs-modules/mailer';
import { MailInterface } from './interface/MailInterface';
import QueueService from './queue.service';
// import { ArticleInterface } from './interface/article.interface';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: QueueService) {}

  async sendUserConfirmationMail(email: string, url: string, token: string, name: string) {
    const link = `${url}?token=${token}`;
    const mailPayload: MailInterface = {
      to: email,
      context: {
        link,
        email,
        name,
      },
    };

    await this.mailerService.sendMail({ variant: 'welcome', mail: mailPayload });
  }



  async sendForgotPasswordMail(email: string, url: string, token: string, name: string) {
    const link = `${url}?token=${token}`;
    const mailPayload: MailInterface = {
      to: email,
      context: {
        link,
        email,
        name
      },
    };

    await this.mailerService.sendMail({ variant: 'reset-password', mail: mailPayload });

  }

  
  


}
