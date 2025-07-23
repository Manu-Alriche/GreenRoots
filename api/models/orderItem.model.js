import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class OrderItem extends Model {}

OrderItem.init({
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "order_item"
});
