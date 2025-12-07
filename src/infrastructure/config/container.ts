import { LoginUseCase } from "../../application/use-cases/auth/login.usecase.js";
import { RegisterUseCase } from "../../application/use-cases/auth/register.usecase.js";
import { VerifyEmailUseCase } from "../../application/use-cases/auth/verify-email.usecase.js";
import { CreateSurveyUseCase } from "../../application/use-cases/survey/create-survey.usecase.js";
import { AuthController } from "../../interfaces/http/controllers/auth.controller.js";
import { SurveyController } from "../../interfaces/http/controllers/survey.controller.js";
import { MongoLogicRuleRepository } from "../repositories/mongo/mongo-logic-rule.repository.js";
import { MongoQuestionRepository } from "../repositories/mongo/mongo-question.repository.js";
import { MongoRefreshTokenRepository } from "../repositories/mongo/mongo-refresh-token.repository.js";
import { MongoSurveyRepository } from "../repositories/mongo/mongo-survey.repository.js";
import { MongoUserRepository } from "../repositories/mongo/mongo-user.repository.js";
import { MongoVerificationTokenRepository } from "../repositories/mongo/mongo-verification-token.repository.js";
import { BcryptService } from "../services/bcrypt.service.js";
import { CryptoService } from "../services/crypto.service.js";
import { JwtTokenService } from "../services/jwt-token.service.js";

// 1. Instanciar implementaciones (Clases de bajo nivel)
// REPOSITORIOS
const userRepository = new MongoUserRepository();
const verificationTokenRepository = new MongoVerificationTokenRepository();
const refreshTokenRepository = new MongoRefreshTokenRepository();
const surveyRepository = new MongoSurveyRepository();
const questionRepository = new MongoQuestionRepository();
const logicRuleRepository = new MongoLogicRuleRepository();

// SERVICIOS
const bcryptService = new BcryptService();
const cryptoService = new CryptoService();
export const jwtTokenService = new JwtTokenService("LLAVESECRETAACCEESS", "REFRESHCLAVESECRETA"); // cambiar por ENV

// 2. Inyectar dependencias en los Casos de Uso
const registerUseCase = new RegisterUseCase(
  userRepository,
  bcryptService,
  cryptoService,
  verificationTokenRepository
);

const verifyEmailUseCase = new VerifyEmailUseCase(
  userRepository,
  verificationTokenRepository,
  jwtTokenService,
  refreshTokenRepository,
  cryptoService
);

const loginUseCase = new LoginUseCase(
  bcryptService,
  userRepository,
  jwtTokenService,
  refreshTokenRepository,
  cryptoService,
  verificationTokenRepository
);

const createSurveyUseCase = new CreateSurveyUseCase(
  userRepository,
  cryptoService,
  surveyRepository,
  questionRepository,
  logicRuleRepository
);

// 3. Inyectar Casos de Uso en los Controladores
export const authController = new AuthController({
  registerUseCase,
  verifyEmailUseCase,
  loginUseCase,
});

export const surveyController = new SurveyController({
  createSurveyUseCase,
});
