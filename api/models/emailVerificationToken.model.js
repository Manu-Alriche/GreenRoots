// models/emailVerificationToken.model.js
import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";
import crypto from 'crypto';

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export class EmailVerificationToken extends Model {
  isExpired() {
    return new Date() > this.expires_at;
  }
  isValid() {
    return !this.used && !this.isExpired();
  }
}

EmailVerificationToken.init({
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
    defaultValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 heures
  },
  used: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  tableName: "email_verification_tokens",
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