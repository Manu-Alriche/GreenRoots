// controllers/contact.controller.js
import { StatusCodes } from "http-status-codes";
import { sendContactEmail, sendContactConfirmation } from "../utils/sendEmail.js";

export async function sendMailContact(req, res) {
    try {
        const { prenom, nom, email, content } = req.body;
        
        if (!prenom || !nom || !email || !content) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                content: 'Tous les champs (prénom, nom, email, message) sont requis.' 
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                content: 'Format d\'email invalide.' 
            });
        }
        if (content.length < 10) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                content: 'Le message doit contenir au moins 10 caractères.' 
            });
        }
        if (content.length > 1000) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                content: 'Le message ne peut pas dépasser 1000 caractères.' 
            });
        }
        
        const contactData = {
            prenom: prenom.trim(),
            nom: nom.trim(),
            email: email.trim().toLowerCase(),
            content: content.trim()
        };
        
        try {
            await sendContactEmail(contactData);
            await sendContactConfirmation(contactData.email, `${contactData.prenom} ${contactData.nom}`);            
            res.status(StatusCodes.OK).json({ 
                content: 'Message envoyé avec succès ! Vous recevrez une confirmation par email.' 
            });
            
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi d\'email:', emailError);
            res.status(StatusCodes.OK).json({ 
                content: 'Message reçu avec succès ! Nous vous recontacterons rapidement.' 
            });
        }
        
    } catch (error) {
        console.error('Erreur dans sendMailContact:', error);       
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            content: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.' 
        });
    }
}