import type { IAnswerRepository } from "../../domain/answer/answer.repository.js";
import type { ILogicRuleRepository } from "../../domain/logic-rule/logic-rule.repository.js";
import type { IQuestionStatsRepository } from "../../domain/question-stats/question-stats.repository.js";
import type { IQuestionRepository } from "../../domain/question/question.repository.js";
import type { IRefreshTokenRepository } from "../../domain/refresh-token/refresh-token.repository.js";
import type { IResponseSessionRepository } from "../../domain/response-session/response-session.repository.js";
import type { ISurveyStatsRepository } from "../../domain/survey-stats/survey-stats.repository.js";
import type { ISurveyRepository } from "../../domain/survey/survey.repository.js";
import type { IUserRepository } from "../../domain/user/user.repository.js";
import type { IVerificationTokenRepository } from "../../domain/verification-token/verification-token.repository.js";

export interface IUnitOfWork {
  auth: {
    userRepository: IUserRepository;
    verificationTokenRepository: IVerificationTokenRepository;
    refreshTokenRepository: IRefreshTokenRepository;
  };

  survey: {
    surveyRepository: ISurveyRepository;
    questionRepository: IQuestionRepository;
    logicRuleRepository: ILogicRuleRepository;
    surveyStatsRepository: ISurveyStatsRepository;
    questionStatsRepository: IQuestionStatsRepository;
    answerRepository: IAnswerRepository;
    responseSessionRepository: IResponseSessionRepository;
  };

  execute<T>(work: (unitOfWork: this) => Promise<T>): Promise<T>;
}
