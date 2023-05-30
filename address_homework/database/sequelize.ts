import * as dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect
  }
);
