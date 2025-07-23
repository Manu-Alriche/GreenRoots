import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";
import crypto from 'crypto';

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export class PasswordResetToken extends Model {
  isExpired() {
    return new Date() > this.expires_at;
  }
  isValid() {
    return !this.used && !this.isExpired();
  }
}

PasswordResetToken.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    defaultValue: generateToken
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => new Date(Date.now() + 60 * 60 * 1000) // 1 heure
  },
  used: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  tableName: "password_reset_tokens",
  indexes: [
    {
      fields: ['token']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['expires_at']
    }
  ]
});