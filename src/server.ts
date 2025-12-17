import "dotenv/config";
import { validateEnv } from "./infrastructure/config/env.js";

validateEnv()

import mongoose from "mongoose";
import app from "./app.js";
import createAuthRoutes from "./interfaces/http/routes/auth.routes.js";
import {
  authController,
  jwtTokenService,
  logger,
  surveyController,
} from "./infrastructure/config/container.js";
import { errorHandler } from "./interfaces/http/middlewares/error-handler.middleware.js";
import createSurveyRoutes from "./interfaces/http/routes/survey.routes.js";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 10, 
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 80,
  standardHeaders: true, 
  legacyHeaders: false,
});

app.use("/auth", authLimiter, createAuthRoutes(authController));

app.use(generalLimiter);

app.use("/survey", createSurveyRoutes(surveyController, jwtTokenService));

app.use(errorHandler(logger));

const PORT = process.env.PORT ?? 3000;
const MONGO_URI =
  process.env.MONGO_URI ??
  "mongodb://admin:secret123@localhost:27017/?authMechanism=DEFAULT";

(async () => {
  try {
    mongoose.set("debug", true);

    await mongoose.connect(MONGO_URI);
    console.log("🔌 Conectado a MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar la app", error);
    process.exit(1);
  }
})();
