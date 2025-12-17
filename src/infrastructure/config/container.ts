import { LoginUseCase } from "../../application/use-cases/auth/login.usecase.js";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refresh-token.usecase.js";
import { RegisterUseCase } from "../../application/use-cases/auth/register.usecase.js";
import { VerifyEmailUseCase } from "../../application/use-cases/auth/verify-email.usecase.js";
import { StartResponseSessionUseCase } from "../../application/use-cases/response-session/start-response-session.usecase.js";
import { GetSurveyStatsByIdUseCase } from "../../application/use-cases/survey-stats/get-survey-stats-by-id.usecase.js";
import { AbandonSurveyUseCase } from "../../application/use-cases/survey/abandon-survey.usecase.js";
import { CreateSurveyUseCase } from "../../application/use-cases/survey/create-survey.usecase.js";
import { GetSurveyByIdUseCase } from "../../application/use-cases/survey/get-survey-by-id.usecase.js";
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
import { WinstonLogger } from "../services/winston.logger.js";
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
export const logger = new WinstonLogger();

// Inyectar dependencias en los Casos de Uso
const registerUseCase = new RegisterUseCase(
  userRepository,
  bcryptService,
  tokenService,
  unitOfWork,
  logger
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
  verificationTokenRepository,
  logger
);

const createSurveyUseCase = new CreateSurveyUseCase(
  tokenService,
  unitOfWork,
  logger
);

const startResponseSessionUseCase = new StartResponseSessionUseCase(
  tokenService,
  responseSessionRepository,
  surveyRepository,
  logger
);

const submitSurveyUseCase = new SubmitSurveyUseCase(
  responseSessionRepository,
  questionRepository,
  logicRuleRepository,
  tokenService,
  surveyStatsRepository,
  questionStatsRepository,
  unitOfWork,
  surveyRepository,
  logger
);

const abandonSurveyUseCase = new AbandonSurveyUseCase(
  responseSessionRepository,
  questionRepository,
  logicRuleRepository,
  surveyStatsRepository,
  questionStatsRepository,
  unitOfWork,
  logger
);

const getSurveyByIdUseCase = new GetSurveyByIdUseCase(
  surveyRepository,
  questionRepository,
  logicRuleRepository
);

const refreshTokenUseCase = new RefreshTokenUseCase(
  refreshTokenRepository,
  jwtTokenService,
  bcryptService,
  logger
);

const getSurveyStatsByIdUseCase = new GetSurveyStatsByIdUseCase(
  surveyRepository,
  surveyStatsRepository,
  questionStatsRepository,
  questionRepository
);

// 3. Inyectar Casos de Uso en los Controladores
export const authController = new AuthController({
  registerUseCase,
  verifyEmailUseCase,
  loginUseCase,
  refreshTokenUseCase,
});

export const surveyController = new SurveyController({
  createSurveyUseCase,
  startResponseSessionUseCase,
  submitSurveyUseCase,
  abandonSurveyUseCase,
  getSurveyByIdUseCase,
  getSurveyStatsByIdUseCase,
});
