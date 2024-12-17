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

  // async sendUserEmailConfirmationOtp(email: string, otp: string) {
  //   const mailPayload: MailInterface = {
  //     to: email,
  //     context: {
  //       otp,
  //       email,
  //     },
  //   };

  //   await this.mailerService.sendMail({ variant: 'register-otp', mail: mailPayload });
  // }

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
    // await this.mailerService.sendMail({ variant: 'password-reset', mail: mailPayload });

  }

  async sendWaitListMail(email: string, url: string) {
    const mailPayload: MailInterface = {
      to: email,
      context: {
        url,
        email,
      },
    };

    await this.mailerService.sendMail({ variant: 'waitlist', mail: mailPayload });
  }

  // async sendNewsLetterMail(email: string, articles: ArticleInterface[]) {
  //   const mailPayload: MailInterface = {
  //     to: email,
  //     context: {
  //       email,
  //       articles,
  //     },
  //   };

  //   await this.mailerService.sendMail({ variant: 'newsletter', mail: mailPayload });
  // }

  async sendLoginOtp(email: string, token: string) {
    const mailPayload: MailInterface = {
      to: email,
      context: {
        email,
        token,
      },
    };

    await this.mailerService.sendMail({ variant: 'login-otp', mail: mailPayload });
  }


}
