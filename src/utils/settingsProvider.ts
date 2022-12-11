import path from "path";
process.env.NODE_CONFIG_DIR = path.resolve("src", "config");
import config from "config";
import { Dialect } from "sequelize/types";
import { OperatorsAliases } from "sequelize";

interface DialectOptions {
  ssl: {
    require: boolean;
    rejectUnauthorized: boolean;
  };
}

const environment = process.env.NODE_ENV || "development";
class SettingsProvider {
  getDatabaseSettings(): DatabaseSettings {
    return config.get<DatabaseSettings>(environment);
  }
}

export const settingsProvider = new SettingsProvider();

interface DatabaseSettings {
  dialect: Dialect;
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  dialectOptions: DialectOptions;
  operatorsAliases: OperatorsAliases;
}
