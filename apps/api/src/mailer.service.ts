import * as nodemailer from 'nodemailer';

export class MailerService {
  private readonly mailer: nodemailer.Transporter;

  constructor() {
    this.mailer = nodemailer.createTransport({
      host: process.env.MAILHOG_HOST,
      port: parseInt(process.env.MAILHOG_PORT, 10),
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendCreatedAccountEmail({
    recipient,
    firstName,
  }: {
    recipient: string;
    firstName: string;
  }) {
    try {
      const data = await this.mailer.sendMail({
        from: 'Alexandre <contact@alexandredissi.fr>',
        to: [recipient],
        subject: 'Bienvenue sur la plateforme',
        html: `Bonjour ${firstName}, et bienvenue sur NestJS Chat ! Nous sommes <strong>heureux</strong> de vous avoir parmi nous.`,
      });

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async sendRequestedPasswordEmail({
    recipient,
    firstName,
    token,
  }: {
    recipient: string;
    firstName: string;
    token: string;
  }) {
    try {
      const link = `${process.env.APP_URL}/auth/reset-password/${token}`;
      const data = await this.mailer.sendMail({
        from: 'Acme <onboarding@resend.dev>',
        to: [recipient],
        subject: 'Pour réinitialiser votre mot de passe ...',
        html: `Bonjour ${firstName}, voici votre lien de réinitialisation de mot de passe : ${link}`,
      });

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
}
