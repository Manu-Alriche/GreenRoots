// routes/emailVerification.routes.js
import express from "express";
import { 
    verifyEmail, 
    resendVerificationEmail, 
    checkVerificationStatus 
} from "../controllers/emailVerification.controller.js";

const router = express.Router();

router.get("/verify/:token", verifyEmail);
router.post("/resend", resendVerificationEmail);
router.get("/status/:email", checkVerificationStatus);

export default router;