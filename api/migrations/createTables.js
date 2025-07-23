// migrations/createTables.js - Version complète
import { sequelize } from "../models/sequelize.client.js";
import {
  User,
  Role,
  Tree,
  Order,
  OrderItem,
  EmailVerificationToken,
  PasswordResetToken,
} from "../models/index.js";

console.log("🗑️ Suppression des tables existantes...");

try {
  await PasswordResetToken.drop({ cascade: true, force: true });
  await EmailVerificationToken.drop({ cascade: true, force: true });
  await OrderItem.drop({ cascade: true, force: true });
  await Order.drop({ cascade: true, force: true });
  await sequelize.query('DROP TYPE IF EXISTS "enum_tree_status" CASCADE;');
  await sequelize.query('DROP TABLE IF EXISTS "tree" CASCADE;');

  await User.drop({ cascade: true, force: true });
  await Role.drop({ cascade: true, force: true });

  console.log("✅ Tables supprimées avec succès");
} catch (error) {
  console.log("⚠️ Erreur lors de la suppression:", error.message);
  console.log("Continuing with table creation...");
}

console.log("🏗️ Création des tables...");
try {
  await Role.sync({ force: true });
  await User.sync({ force: true });
  await Tree.sync({ force: true });
  await Order.sync({ force: true });
  await OrderItem.sync({ force: true });
  await EmailVerificationToken.sync({ force: true });
  await PasswordResetToken.sync({ force: true });
  console.log("🎉 Toutes les tables ont été créées avec succès !");
} catch (error) {
  console.error("❌ Erreur lors de la création des tables:", error);
  throw error;
}
await sequelize.close();
