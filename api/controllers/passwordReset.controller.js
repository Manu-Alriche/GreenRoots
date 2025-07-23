import { StatusCodes } from "http-status-codes";
import { scrypt } from '../utils/scrypt.js';
import { User, PasswordResetToken, sequelize } from '../models/index.js';
import { sendPasswordResetEmail, sendPasswordResetConfirmation } from '../utils/passwordResetEmails.js';
import { Op } from 'sequelize';

export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;        
        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'L\'email est requis.'
            });
        }        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Format d\'email invalide.'
            });
        }        
        const user = await User.findOne({
            where: { email: email.toLowerCase().trim() }
        });       
        const successMessage = 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.';        
        if (!user) {
            return res.status(StatusCodes.OK).json({ message: successMessage });
        }        
        await PasswordResetToken.destroy({ where: { user_id: user.id } });
        const resetToken = await PasswordResetToken.create({ user_id: user.id });        
        try {
            await sendPasswordResetEmail(
                user.email,
                `${user.firstName} ${user.lastName}`,
                resetToken.token
            );
        } catch (emailError) {
            console.error('Erreur envoi email reset password:', emailError);
        }
        
        res.status(StatusCodes.OK).json({ message: successMessage });        
    } catch (error) {
        console.error('Erreur requestPasswordReset:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Une erreur est survenue. Veuillez réessayer.'
        });
    }
}

export async function verifyResetToken(req, res) {
    try {
        const { token } = req.params;        
        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Token manquant.'
            });
        }       
        const resetToken = await PasswordResetToken.findOne({
            where: {
                token,
                used: false,
                expires_at: { [Op.gt]: new Date() }
            },
            include: [{
                model: User,
                as: 'user',
                attributes: ['email', 'firstName', 'lastName']
            }]
        });        
        if (!resetToken) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Token invalide ou expiré.'
            });
        }       
        res.status(StatusCodes.OK).json({
            message: 'Token valide.',
            email: resetToken.user.email
        });       
    } catch (error) {
        console.error('Erreur verifyResetToken:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Une erreur est survenue. Veuillez réessayer.'
        });
    }
}

export async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;        
        if (!token || !newPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Token et nouveau mot de passe requis.'
            });
        }       
        if (newPassword.length < 8) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Le mot de passe doit contenir au moins 8 caractères.'
            });
        }        
        const resetToken = await PasswordResetToken.findOne({
            where: {
                token,
                used: false,
                expires_at: { [Op.gt]: new Date() }
            },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName']
            }]
        });       
        if (!resetToken) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Token invalide ou expiré.'
            });
        }        
        const hashedPassword = scrypt.hash(newPassword);       
        const result = await sequelize.transaction(async (t) => {
            await User.update(
                { password: hashedPassword },
                { where: { id: resetToken.user.id }, transaction: t }
            );
            await resetToken.update({ used: true }, { transaction: t });
            await PasswordResetToken.destroy({
                where: {
                    user_id: resetToken.user.id,
                    id: { [Op.ne]: resetToken.id }
                },
                transaction: t
            });
            return resetToken.user;
        });        
        try {
            await sendPasswordResetConfirmation(
                result.email,
                `${result.firstName} ${result.lastName}`
            );
        } catch (emailError) {
            console.error('Erreur envoi email confirmation:', emailError);
        }
        
        res.status(StatusCodes.OK).json({
            message: 'Mot de passe modifié avec succès.'
        });        
    } catch (error) {
        console.error('Erreur resetPassword:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Une erreur est survenue. Veuillez réessayer.'
        });
    }
}