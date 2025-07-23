import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { scrypt } from '../utils/scrypt.js'
import { StatusCodes } from 'http-status-codes';
import { Role } from '../models/role.model.js';
import { sequelize } from '../models/sequelize.client.js';
import { EmailVerificationToken } from '../models/index.js';
import { sendEmailVerification } from '../utils/emailVerificationEmails.js';

export async function register(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Tous les champs sont requis.'
            });
        }
        const existingUser = await User.findOne({
            where: { email: email.toLowerCase().trim() }
        });       
        if (existingUser) {
            if (existingUser.email_verified) {
                return res.status(StatusCodes.CONFLICT).json({
                    message: 'Un compte avec cet email existe déjà.'
                });
            } else {
                return res.status(StatusCodes.CONFLICT).json({
                    message: 'Un compte avec cet email existe déjà mais n\'est pas vérifié. Vérifiez votre email ou demandez un nouveau lien.',
                    needsVerification: true,
                    email: existingUser.email
                });
            }
        }     
        const hashedPassword = scrypt.hash(password);       
        const result = await sequelize.transaction(async (t) => {
            const user = await User.create({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role_id: 2,
                email_verified: false
            }, { transaction: t });            
            const verificationToken = await EmailVerificationToken.create({
                user_id: user.id
            }, { transaction: t });
            
            return { user, verificationToken };
        });
        try {
            await sendEmailVerification(
                result.user.email,
                `${result.user.firstName} ${result.user.lastName}`,
                result.verificationToken.token
            );
        } catch (emailError) {
            console.error('Erreur envoi email vérification:', emailError);
        }
        
        res.status(StatusCodes.CREATED).json({
            message: 'Compte créé avec succès ! Vérifiez votre email pour activer votre compte.',
            user: {
                id: result.user.id,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                email: result.user.email,
                email_verified: result.user.email_verified
            },
            needsVerification: true
        });
        
    } catch (error) {
        console.error('Erreur register:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Une erreur est survenue lors de la création du compte.'
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Email et mot de passe requis.'
            });
        } 
        const user = await User.findOne({
            where: { email: email.toLowerCase().trim() },
            include: [{
                model: Role,
                as: 'role'
            }]
        });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Email ou mot de passe incorrect.'
            });
        }
        const isValidPassword = scrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Email ou mot de passe incorrect.'
            });
        }
        if (!user.email_verified) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Votre email n\'est pas encore vérifié. Vérifiez votre boîte email ou demandez un nouveau lien.',
                needsVerification: true,
                email: user.email
            });
        }
        const token = jwt.sign(
            { user_id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(StatusCodes.OK).json({
            message: 'Connexion réussie.',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role?.name
            }
        });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Une erreur est survenue lors de la connexion.'
        });
    }
}

export async function me(req, res) {
    const userId = req.userId;
    try {
        const user = await User.findByPk(userId, {
            include: [{ model: Role, as: 'role' }]
        });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Utilisateur non trouvé" });
        }
        return res.status(StatusCodes.OK).json(user);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
}