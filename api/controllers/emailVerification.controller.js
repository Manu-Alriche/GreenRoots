import { StatusCodes } from "http-status-codes";
import { User, EmailVerificationToken, sequelize } from '../models/index.js';
import { sendEmailVerification, sendEmailVerificationSuccess } from '../utils/emailVerificationEmails.js';
import { Op } from 'sequelize';

export async function verifyEmail(req, res) {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Token de vérification manquant.'
            });
        }
        const verificationToken = await EmailVerificationToken.findOne({
            where: {
                token,
                used: false,
                expires_at: {
                    [Op.gt]: new Date()
                }
            },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName', 'email_verified']
            }]
        });       
        if (!verificationToken) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Token de vérification invalide ou expiré.'
            });
        }       
        if (verificationToken.user.email_verified) {
            return res.status(StatusCodes.OK).json({
                message: 'Email déjà vérifié.',
                user: {
                    email: verificationToken.user.email,
                    firstName: verificationToken.user.firstName,
                    lastName: verificationToken.user.lastName
                }
            });
        }
        const result = await sequelize.transaction(async (t) => {
            await User.update(
                { 
                    email_verified: true,
                    email_verified_at: new Date()
                },
                { 
                    where: { id: verificationToken.user.id },
                    transaction: t
                }
            );
            await verificationToken.update(
                { used: true },
                { transaction: t }
            );
            await EmailVerificationToken.destroy({
                where: {
                    user_id: verificationToken.user.id,
                    id: {
                        [Op.ne]: verificationToken.id
                    }
                },
                transaction: t
            });
            
            return verificationToken.user;
        });
        try {
            await sendEmailVerificationSuccess(
                result.email,
                `${result.firstName} ${result.lastName}`
            );
        } catch (emailError) {
            console.error('Erreur envoi email confirmation vérification:', emailError);
        }       
        res.status(StatusCodes.OK).json({
            message: 'Email vérifié avec succès.',
            user: {
                email: result.email,
                firstName: result.firstName,
                lastName: result.lastName
            }
        });       
    } catch (error) {
        console.error('Erreur verifyEmail:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Une erreur est survenue lors de la vérification.'
        });
    }
}

export async function resendVerificationEmail(req, res) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Email requis.'
            });
        }
        const user = await User.findOne({
            where: {
                email: email.toLowerCase().trim()
            }
        });       
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Aucun compte trouvé avec cet email.'
            });
        }
        if (user.email_verified) {
            return res.status(StatusCodes.OK).json({
                message: 'Cet email est déjà vérifié.'
            });
        }
        await EmailVerificationToken.destroy({
            where: {
                user_id: user.id
            }
        });
        const verificationToken = await EmailVerificationToken.create({
            user_id: user.id
        });
        try {
            await sendEmailVerification(
                user.email,
                `${user.firstName} ${user.lastName}`,
                verificationToken.token
            );            
            res.status(StatusCodes.OK).json({
                message: 'Email de vérification renvoyé avec succès.'
            });
        } catch (emailError) {
            console.error('Erreur envoi email vérification:', emailError);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Erreur lors de l\'envoi de l\'email de vérification.'
            });
        }        
    } catch (error) {
        console.error('Erreur resendVerificationEmail:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Une erreur est survenue.'
        });
    }
}

export async function checkVerificationStatus(req, res) {
    try {
        const { email } = req.params;       
        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Email requis.'
            });
        }       
        const user = await User.findOne({
            where: {
                email: email.toLowerCase().trim()
            },
            attributes: ['email', 'email_verified', 'email_verified_at']
        });        
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Utilisateur non trouvé.'
            });
        }        
        res.status(StatusCodes.OK).json({
            email: user.email,
            verified: user.email_verified,
            verified_at: user.email_verified_at
        });        
    } catch (error) {
        console.error('Erreur checkVerificationStatus:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Une erreur est survenue.'
        });
    }
}