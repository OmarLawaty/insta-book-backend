import * as nodemailer from 'nodemailer';

export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendResetCode(email: string, code: string) {
    await this.transporter.sendMail({
      from: '"Instabook" <omarlawatey@gmail.com>',
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${code}`,
    });
  }
}
