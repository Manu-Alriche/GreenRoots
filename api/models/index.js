import { User } from "./user.model.js";
import { Role } from "./role.model.js";
import { Tree } from "./tree.model.js";
import { Order } from "./order.model.js";
import { OrderItem } from "./orderItem.model.js";
import { PasswordResetToken } from "./passwordResetToken.model.js";
import { EmailVerificationToken } from "./emailVerificationToken.model.js";
import { sequelize } from "./sequelize.client.js";

Role.hasMany(User, {
  as: "users",
  foreignKey: {
    name: "role_id",
    allowNull: false
  }
});
User.belongsTo(Role, {
  as: "role",
  foreignKey: "role_id"
});
User.hasMany(Order, {
  as: "orders",
  foreignKey: {
    name: "user_id",
    allowNull: false
  },
  onDelete: "CASCADE"
});
Order.belongsTo(User, {
  as: "user",
  foreignKey: "user_id"
});
OrderItem.belongsTo(Tree, {
  as: "tree",
  foreignKey: "tree_id"
});
Order.belongsToMany(Tree, {
  as: "trees",
  through: OrderItem,
  foreignKey: "order_id",
  otherKey: "tree_id"
});
Order.hasMany(OrderItem, {
  as: "orderItems",
  foreignKey: "order_id"
});
OrderItem.belongsTo(Order, {
  foreignKey: "order_id"
});
Tree.belongsToMany(Order, {
  as: "orders",
  through: OrderItem,
  foreignKey: "tree_id",
  otherKey: "order_id"
});
User.hasMany(PasswordResetToken, {
  as: "passwordResetTokens",
  foreignKey: "user_id"
});
PasswordResetToken.belongsTo(User, {
  as: "user",
  foreignKey: "user_id"
});
User.hasMany(EmailVerificationToken, {
  as: "emailVerificationTokens",
  foreignKey: "user_id"
});

EmailVerificationToken.belongsTo(User, {
  as: "user",
  foreignKey: "user_id"
});

export {
  User,
  Role,
  Tree,
  Order,
  OrderItem,
  PasswordResetToken,
  EmailVerificationToken,
  sequelize
};