import { sendEmail } from './sendEmail.js';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function sendEmailVerification(userEmail, userName, verificationToken) {
  const subject = "✉️ Vérifiez votre adresse email - GreenRoots";
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

  const html = await ejs.renderFile(
    path.join(__dirname, '../views/emails/verification-email.ejs'),
    { userName, verificationUrl }
  );

  return await sendEmail(userEmail, subject, html);
}

export async function sendEmailVerificationSuccess(userEmail, userName) {
  const subject = "🎉 Email vérifié avec succès - GreenRoots";
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  const html = await ejs.renderFile(
    path.join(__dirname, '../views/emails/verification-success.ejs'),
    { userName, frontendUrl }
  );

  return await sendEmail(userEmail, subject, html);
}
