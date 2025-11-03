import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { WelcomeMailer } from './template/auth/welcomeMailer';

@Injectable()
export class MailerService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendCreateAccountWelcome(email: string) {
    const welcomeMail = `${process.env.FRONTEND_URL}/login`;
    await this.transporter.sendMail({
      from: '"Soporte" <eddie@eddieHG.com>',
      to: email,
      subject: 'Bienvenido a Prestamype',
      html: WelcomeMailer(welcomeMail, email),
    });
  }
}
