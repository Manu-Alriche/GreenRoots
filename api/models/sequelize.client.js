import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  logging: false,
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // important pour Railway
    },
  },
});

// Vérifie la connexion
try {
  await sequelize.authenticate();
  console.log("✅ Connecté à PostgreSQL");
} catch (err) {
  console.error("❌ Erreur connexion DB :", err);
}
