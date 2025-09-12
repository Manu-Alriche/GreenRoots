import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import passwordResetRoutes from "./routes/passwordReset.routes.js";
import emailVerificationRoutes from "./routes/emailVerification.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import path from "path";

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

const app = express();
const corsOption = {
  origin: [process.env.FRONTEND_URL, "https://greenroots-flax.vercel.app"],
};

app.use(cors(corsOption));

app.use("/public", express.static(path.join(process.cwd(), "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());

app.use(
  "/images/arbres",
  express.static(path.join(__dirname, "public/images/arbres"))
);

app.use("/produits", productRoutes);
app.use("/commandes", orderRoutes);
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
app.use("/password-reset", passwordResetRoutes);
app.use("/email-verification", emailVerificationRoutes);
app.use("/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
