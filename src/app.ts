import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.use(cookieParser());

export default app;


// 4. Hacer CI (github actions).

// Crear README

