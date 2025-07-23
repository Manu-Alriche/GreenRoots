import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Order extends Model {}

function generateReference() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

Order.init(
  {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    localisation: DataTypes.STRING,
    note: DataTypes.TEXT,
    total: DataTypes.FLOAT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      allowNull: false
    },
    stripeSessionId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    reference: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      defaultValue: generateReference,
    },
  },
  {
    sequelize,
    tableName: "order",
  }
);
