import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';

export async function sendEmail(email: string, subject: string, username: string, url: string) {
  if (process.env.NODE_ENV === 'test') {
    return true;
  }

  const source = await fs.promises.readFile('mailTemplates/resetPasswordTemplate.html', 'utf-8');

  const template = handlebars.compile(source.toString());

  const replacements = {
    username,
    url,
  };

  const htmlToSend = template(replacements);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: '<webSocketChat@gmail.com>',
    to: email,
    subject: subject,
    html: htmlToSend,
  };

  const result = await transporter.sendMail(mailOptions);

  return result;
}
