import express from "express";
import { login, register, me } from "../controllers/auth.controller.js";
import { validateUserCreation, authenticate, loginRateLimit } from "../middlewares/auth.middleware.js";   

const router = express.Router();

router.post("/register", validateUserCreation, register);
router.post("/login", loginRateLimit, login);
router.get("/me", authenticate, me)

export default router;