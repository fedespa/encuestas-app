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

// 1. Crear DockerFile (dockerizar backend)
// 2. Subir la db a MongoDB atlas
// 3. Subir backend a railway u otro
// 4. Hacer CI (github actions).

// Crear README

// NO subir a produccion docker-compose.yml. 
