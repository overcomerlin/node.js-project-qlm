import dotenv from "dotenv";
dotenv.config();
import config from "./src/config/index.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import { initRedis, redis } from "./src/redis/redis.connector.js";
import session from "express-session";
import { RedisStore } from "connect-redis";
import errorHandler from "./src/middlewares/errorHandler.js";
import redisRouter from "./src/redis/redis.router.js";
import userInfoRouter from "./src/routes/route.userInfo.js";
import crtfDataRouter from "./src/routes/route.crtfData.js";
import userRouter from "./src/routes/route.user.js";
import comnpanyRouter from "./src/routes/route.company.js";

// import exp_validaor from "express-validator";
// import bcrypt from "bcrypt";
// import cookieParser from "cookie-parser";

const app = express();

// Security and protection
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cors(...));
const ALLOWED_ORIGINS = new Set([
  // "https://app.example.com", // React official
  // "http://localhost:3000", // CRA or Next dev
  "http://localhost:5173", // Vite default
  "http://localhost",
  // "http://35.234.16.141",
]);

const corsOptions = {
  origin(origin, callback) {
    // Request without Origin
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // use cookie / Authorization header
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Total-Count"], // the header read by clients
  maxAge: 600, // request cach for 10 mins
};

app.use(cors(corsOptions));

// Require logs
app.use(morgan(config.env === "production" ? "combined" : "dev"));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

await initRedis();
const redisStore = new RedisStore({ client: redis, prefix: "session:" });

app.use(
  session({
    secret: config.redis.password,
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    rolling: false,
    cookie: {
      httpOnly: true,
      secure: config.isProd,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000 * 24,
    },
  })
);

app.use("/api", redisRouter);
app.use("/data", userInfoRouter);
app.use("/data", crtfDataRouter);
app.use("/data", userRouter);
app.use("/data", comnpanyRouter);

// Error handler
app.use(errorHandler);

export default app;
