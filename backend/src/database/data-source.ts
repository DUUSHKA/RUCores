import "reflect-metadata"
import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "rucoresSchema",
    synchronize: true,
    logging: true,
    entities: ["src/database/Entities/**/*.{js,ts}"],
    subscribers: [],
    migrations: [],
})

export default AppDataSource;