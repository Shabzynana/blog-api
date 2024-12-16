import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { MailInterface } from './interface/MailInterface';

Injectable();
export default class QueueService {
  constructor(
    @InjectQueue('emailSending')
    private readonly emailQueue: Queue
  ) {}

  async sendMail({ variant, mail }: MailSender) {
    const mailJob = await this.emailQueue.add(variant, { mail });
    console.log({ jobId: mailJob.id });
    return { jobId: mailJob.id };

  }
}

export interface MailSender {
  mail: MailInterface;
  variant:
    | 'welcome'
    | 'waitlist'
    | 'newsletter'
    | 'reset-password'
    | 'password-reset'
    | 'login-otp'
    | 'register-otp'
    | 'in-app-notification';
}
