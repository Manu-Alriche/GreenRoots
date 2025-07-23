// routes/contact.routes.js
import express from "express";
import { sendMailContact} from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", sendMailContact);

export default router;