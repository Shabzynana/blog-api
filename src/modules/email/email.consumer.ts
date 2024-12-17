 import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { MailInterface } from './interface/MailInterface';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('emailSending')
export default class EmailQueueConsumer {
  private logger = new Logger(EmailQueueConsumer.name);
  constructor(private readonly mailerService: MailerService) {}

  @Process('welcome')
  async sendWelcomeEmailJob(job: Job<MailInterface>) {
    try {
      const {
        data: { mail },
      } = job;
      await this.mailerService.sendMail({
        ...mail,
        subject: 'Welcome to My App! Confirm your Email',
        template: 'Email-Verification',
      });
    } catch (sendWelcomeEmailJobError) {
      this.logger.error(`EmailQueueConsumer ~ sendWelcomeEmailJobError:  ${sendWelcomeEmailJobError}`);
    }
  }


  @Process('reset-password')
  async sendResetPasswordEmailJob(job: Job<MailInterface>) {
    try {
      const {
        data: { mail },
      } = job;
      await this.mailerService.sendMail({
        ...mail,
        subject: 'Reset Password',
        // template: 'reset-password',
        template: 'Reset-Password-Template',
      });
    } catch (sendResetPasswordEmailJobError) {
      this.logger.error(`EmailQueueConsumer ~ sendResetPasswordEmailJobError: ${sendResetPasswordEmailJobError}`);
    }
  }

  
}
