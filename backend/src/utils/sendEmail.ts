import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || process.env.FROM_EMAIL || `ServeSync <noreply@servesync.com>`;

  if (!host || !user || !pass) {
    const msg = 'Email configuration missing: SMTP_HOST/EMAIL_HOST, SMTP_USER/EMAIL_USER, SMTP_PASS/EMAIL_PASS must be set';
    console.error(`[sendEmail] ${msg} (host=${!!host} user=${!!user} pass=${!!pass})`);
    throw new Error('Email service is not configured. Please contact support.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, 
    auth: { user, pass },
  });



  const mailOptions = {
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[sendEmail] Email sent to ${options.to} messageId=${info.messageId}`);
  } catch (err: any) 
  {
    console.error(`[sendEmail] Failed to send email to ${options.to}: ${err.message}`);
    throw new Error('Email could not be sent');
  }
};
