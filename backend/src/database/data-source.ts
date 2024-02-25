import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

const mysql_config: DataSourceOptions = {
  type: "mysql",
  host: process.env.MYSQL_HOST ?? "localhost",
  port: parseInt(process.env.MYSQL_PORT ?? "3306"),
  username: process.env.MYSQL_USERNAME ?? "root",
  password: process.env.MYSQL_PASSWORD ?? "root",
  database: process.env.MYSQL_DATABASE ?? "RUCores",
  logging: process.env.DB_LOGGING === "true",
  entities: ["src/database/Entities/**/*.{js,ts}"],
  subscribers: [],
  migrations: [],
  synchronize: process.env.DB_SYNCHRONIZE === "true",
};

const sqlite_config: DataSourceOptions = {
  type: "sqlite",
  database: process.env.DB_DATABASE ?? "database.sqlite3",
  logging: process.env.DB_LOGGING === "true",
  entities: ["src/database/Entities/**/*.{js,ts}"],
  synchronize: process.env.DB_SYNCHRONIZE === "true",
};

const AppDataSource = new DataSource(
  process.env.DB_TYPE === "mysql" ? mysql_config : sqlite_config,
);

export default AppDataSource;
