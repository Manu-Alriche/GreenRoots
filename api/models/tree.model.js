import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

function generateReference() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export class Tree extends Model {}

Tree.init({
  reference: {
    type: DataTypes.STRING(8),
    allowNull: false,
    unique: true,
    defaultValue: generateReference
  },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  },
  deactivatedAt: {
      type: DataTypes.DATE,
      allowNull: true
  },
  imageUrl: DataTypes.STRING
}, {
  sequelize,
  tableName: "tree",
  scopes: {
      active: {
        where: { status: 'active' }
      },
      inactive: {
        where: { status: 'inactive' }
      }
    }
});

