import { DataSource } from "typeorm";
import {
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from "../constants";
import dotenv from "dotenv";
import User from "../entity/User";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT) || 5432, // default port of postgres
  username: POSTGRES_USER, // our created username, you can have your own user name
  password: POSTGRES_PASSWORD, // our created username, you can have your own password
  database: POSTGRES_DB, // our created database name, you can have your own
  entities: [
    // typeORM will not be able to create database table if we forget to put entity class name here..
    User, // our User entity class
  ],
  migrations: ["migrations/*.ts"],
  synchronize: true,
  logging: true,
  migrationsRun: true,
});
