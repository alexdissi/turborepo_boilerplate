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
    lastName,
  }: {
    recipient: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      await this.mailer.sendMail({
        from: 'BoilerPlate Contact <contact@boilerplate.com>',
        to: [recipient],
        subject: 'Bienvenue sur la plateforme',
        html: `Bonjour ${firstName} ${lastName}, et bienvenue sur NestJS Chat ! Nous sommes <strong>heureux</strong> de vous avoir parmi nous.`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendRequestedPasswordEmail({
    recipient,
    firstName,
    lastName,
    token,
  }: {
    recipient: string;
    firstName: string;
    lastName: string;
    token: string;
  }) {
    try {
      const link = `${process.env.APP_URL}/auth/reset-password/${token}`;
      const data = await this.mailer.sendMail({
        from: 'BoilerPlate Contact <contact@boilerplate.com>',
        to: [recipient],
        subject: 'Pour réinitialiser votre mot de passe ...',
        html: `Bonjour ${firstName} ${lastName}, voici votre lien de réinitialisation de mot de passe : ${link}`,
      });

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
}
