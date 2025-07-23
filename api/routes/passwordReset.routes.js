import express from "express";
import { 
    requestPasswordReset, 
    verifyResetToken, 
    resetPassword 
} from "../controllers/passwordReset.controller.js";

const router = express.Router();

router.post("/request", requestPasswordReset);
router.get("/verify/:token", verifyResetToken);
router.post("/reset", resetPassword);

export default router;