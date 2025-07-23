import Joi from "joi";
import { checkBody } from "../utils/common.util.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import rateLimit from 'express-rate-limit';

export const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { error: "Trop de tentatives de connexion. Réessayez dans 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
});

export function validateUserCreation(req, res, next) {
    const createUserSchema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });
    checkBody(createUserSchema, req.body, res, next);
}

export function authenticate(req, res, next){ 
    const authHeader = req.headers.authorization;
    if (! authHeader || ! authHeader.startsWith('Bearer '))
    {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: "Vous n'êtes pas connecté" });
    }
    const token = authHeader.split(' ')[1];

    try {
        const dataDecoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = dataDecoded.user_id;

        next();
    }
    catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({error: 'Token invalide ou expiré'});

    }
}

export function checkRole(requiredRole) {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId, {
        include: { model: Role, as: "role" }
      });

      if (!user || !user.role) {
        return res.status(StatusCodes.FORBIDDEN).json({ error: "Accès refusé" });
      }

      if (user.role.name !== requiredRole) {
        return res.status(StatusCodes.FORBIDDEN).json({ error: "Accès réservé aux administrateurs" });
      }
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur serveur" });
    }
  };
}