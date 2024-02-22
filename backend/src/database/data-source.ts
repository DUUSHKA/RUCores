import "reflect-metadata";
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "3306"),
  username: process.env.DB_USERNAME ?? "root",
  password: process.env.DB_PASSWORD ?? "root",
  database: process.env.DB_DATABASE ?? "RUCores",
  synchronize: true,
  logging: true,
  entities: ["src/database/Entities/**/*.{js,ts}"],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
