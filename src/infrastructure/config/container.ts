import { LoginUseCase } from "../../application/use-cases/auth/login.usecase.js";
import { RegisterUseCase } from "../../application/use-cases/auth/register.usecase.js";
import { VerifyEmailUseCase } from "../../application/use-cases/auth/verify-email.usecase.js";
import { StartResponseSessionUseCase } from "../../application/use-cases/response-session/start-response-session.usecase.js";
import { AbandonSurveyUseCase } from "../../application/use-cases/survey/abandon-survey.usecase.js";
import { CreateSurveyUseCase } from "../../application/use-cases/survey/create-survey.usecase.js";
import { SubmitSurveyUseCase } from "../../application/use-cases/survey/submit-survey.usecase.js";
import { AuthController } from "../../interfaces/http/controllers/auth.controller.js";
import { SurveyController } from "../../interfaces/http/controllers/survey.controller.js";
import { MongoUnitOfWork } from "../db/mongo/mongo-unit-of-work.js";
import { MongoAnswerRepository } from "../repositories/mongo/mongo-answer.repository.js";
import { MongoLogicRuleRepository } from "../repositories/mongo/mongo-logic-rule.repository.js";
import { MongoQuestionStatsRepository } from "../repositories/mongo/mongo-question-stats.repository.js";
import { MongoQuestionRepository } from "../repositories/mongo/mongo-question.repository.js";
import { MongoRefreshTokenRepository } from "../repositories/mongo/mongo-refresh-token.repository.js";
import { MongoResponseSessionRepository } from "../repositories/mongo/mongo-response-session.repository.js";
import { MongoSurveyStatsRepository } from "../repositories/mongo/mongo-survey-stats.repository.js";
import { MongoSurveyRepository } from "../repositories/mongo/mongo-survey.repository.js";
import { MongoUserRepository } from "../repositories/mongo/mongo-user.repository.js";
import { MongoVerificationTokenRepository } from "../repositories/mongo/mongo-verification-token.repository.js";
import { BcryptService } from "../services/bcrypt.service.js";
import { CryptoService } from "../services/crypto.service.js";
import { JwtTokenService } from "../services/jwt-token.service.js";
import { envConfig } from "./env.js";

// REPOSITORIOS
const userRepository = new MongoUserRepository();
const verificationTokenRepository = new MongoVerificationTokenRepository();
const refreshTokenRepository = new MongoRefreshTokenRepository();
const surveyRepository = new MongoSurveyRepository();
const questionRepository = new MongoQuestionRepository();
const logicRuleRepository = new MongoLogicRuleRepository();
const responseSessionRepository = new MongoResponseSessionRepository();
const answerRepository = new MongoAnswerRepository();
const surveyStatsRepository = new MongoSurveyStatsRepository();
const questionStatsRepository = new MongoQuestionStatsRepository();

const unitOfWork = new MongoUnitOfWork(
  {
    userRepository,
    verificationTokenRepository,
    refreshTokenRepository,
  },
  {
    surveyRepository,
    questionRepository,
    logicRuleRepository,
    surveyStatsRepository,
    questionStatsRepository,
    answerRepository,
    responseSessionRepository,
  }
);

// SERVICIOS
const bcryptService = new BcryptService();
const tokenService = new CryptoService();
export const jwtTokenService = new JwtTokenService(
  envConfig.accessTokenSecret,
  envConfig.refreshTokenSecret
); 

// 2. Inyectar dependencias en los Casos de Uso
const registerUseCase = new RegisterUseCase(
  userRepository,
  bcryptService,
  tokenService,
  unitOfWork
);

const verifyEmailUseCase = new VerifyEmailUseCase(
  userRepository,
  verificationTokenRepository,
  jwtTokenService,
  tokenService,
  unitOfWork
);

const loginUseCase = new LoginUseCase(
  bcryptService,
  userRepository,
  jwtTokenService,
  refreshTokenRepository,
  tokenService,
  verificationTokenRepository
);

const createSurveyUseCase = new CreateSurveyUseCase(tokenService, unitOfWork);

const startResponseSessionUseCase = new StartResponseSessionUseCase(
  tokenService,
  responseSessionRepository,
  surveyRepository
);

const submitSurveyUseCase = new SubmitSurveyUseCase(
  responseSessionRepository,
  questionRepository,
  logicRuleRepository,
  tokenService,
  surveyStatsRepository,
  questionStatsRepository,
  unitOfWork
);

const abandonSurveyUseCase = new AbandonSurveyUseCase(
  responseSessionRepository,
  questionRepository,
  logicRuleRepository,
  surveyStatsRepository,
  questionStatsRepository,
  unitOfWork
);

// 3. Inyectar Casos de Uso en los Controladores
export const authController = new AuthController({
  registerUseCase,
  verifyEmailUseCase,
  loginUseCase,
});

export const surveyController = new SurveyController({
  createSurveyUseCase,
  startResponseSessionUseCase,
  submitSurveyUseCase,
  abandonSurveyUseCase,
});
