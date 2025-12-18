import "dotenv/config";
import { envConfig, validateEnv } from "./infrastructure/config/env.js";

validateEnv();

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

const MONGO_URI = envConfig.mongoUri;
const PORT = envConfig.port;

const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000,        
      family: 4                      
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    
    console.log("✅ MongoDB conectado y autenticado");
  } catch (error: any) {
    console.error("Error de autenticación o conexión:", error.message);
    console.log("Reintentando en 5 segundos...");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();
