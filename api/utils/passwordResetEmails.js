import { sendEmail } from './sendEmail.js';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendPasswordResetEmail(userEmail, userName, resetToken) {
    const subject = "🔐 Réinitialisation de votre mot de passe - GreenRoots";

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    
    const templatePath = path.join(__dirname, '../views/emails/password-reset.ejs');
        const templateData = {
        userName,
        resetUrl
    };
        const html = await ejs.renderFile(templatePath, templateData);
    return await sendEmail(userEmail, subject, html);
}

export async function sendPasswordResetConfirmation(userEmail, userName) {
    const subject = "✅ Mot de passe modifié avec succès - GreenRoots";
    const date = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const templatePath = path.join(__dirname, '../views/emails/password-reset-confirmation.ejs');
    
    const templateData = {
        userName,
        date
    };
    const html = await ejs.renderFile(templatePath, templateData);
    return await sendEmail(userEmail, subject, html);
}