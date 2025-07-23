import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

export async function sendEmail(to, subject, html, from = null) {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        
        const mailOptions = {
            from: from || `"GreenRoots Contact" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            replyTo: process.env.EMAIL_USER
        };
        
        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi via Gmail:', error);
        throw new Error(`Erreur d'envoi d'email: ${error.message}`);
    }
}

export async function sendContactEmail(contactData) {
    const { prenom, nom, email, content } = contactData;
    const subject = `📨 Nouveau message de contact - ${prenom} ${nom}`;
    const templatePath = path.join(__dirname, '../views/emails/contact-notification.ejs');
    const templateData = {
        prenom,
        nom,
        email,
        content,
        date: new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    const html = await ejs.renderFile(templatePath, templateData);
    
    return await sendEmail(process.env.CONTACT_RECEIVER_EMAIL, subject, html);
}

export async function sendContactConfirmation(userEmail, userName) {
    const subject = "✅ Confirmation de réception - GreenRoots";
    
    const templatePath = path.join(__dirname, '../views/emails/contact-confirmation.ejs');
    
    const templateData = {
        userName
    };
    
    const html = await ejs.renderFile(templatePath, templateData);
    
    return await sendEmail(userEmail, subject, html);
}