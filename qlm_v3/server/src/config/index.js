import dotenv from "dotenv";
dotenv.config();

export default {
  env: process.env.NODE_ENV || "production",
  port: process.env.PORT || 3000,
  database: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
  },
  bcrypt: {
    cost: process.env.BCRYPT_COST,
    papper: process.env.BCRYPT_PAPPER,
    maxLength: process.env.BCRYPT_MAX_LENGTH,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  isProd: process.env.NODE_ENV === "production",
};
