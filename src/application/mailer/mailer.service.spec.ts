/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import * as nodemailer from 'nodemailer';

jest.mock('./template/auth/welcomeMailer', () => ({
  WelcomeMailer: jest.fn().mockReturnValue('<h1>Bienvenido</h1>'),
}));

jest.mock('nodemailer', () => {
  const sendMailMock = jest.fn();
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: sendMailMock,
    }),
    __mock__: { sendMailMock },
  };
});

describe('MailerService', () => {
  let service: MailerService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    const { __mock__ } = jest.requireMock('nodemailer') as any;
    sendMailMock = __mock__.sendMailMock;
    sendMailMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería crear el transporter usando nodemailer', () => {
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  });

  it('debería enviar un correo de bienvenida correctamente', async () => {
    await service.sendCreateAccountWelcome('test@example.com');

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: '"Soporte" <eddie@eddieHG.com>',
      to: 'test@example.com',
      subject: 'Bienvenido a Prestamype',
      html: '<h1>Bienvenido</h1>',
    });
  });
});
