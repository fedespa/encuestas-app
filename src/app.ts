import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "*", // Cambiar por frontend
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

app.use(cookieParser());

export default app;
