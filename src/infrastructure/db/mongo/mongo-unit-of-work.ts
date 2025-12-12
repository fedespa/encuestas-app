import mongoose, { type ClientSession } from "mongoose";

import type { IUnitOfWork } from "../../../application/services/unit-of-work.js";
import type { IAnswerRepository } from "../../../domain/answer/answer.repository.js";
import type { IResponseSessionRepository } from "../../../domain/response-session/response-session.repository.js";
import type { ISurveyRepository } from "../../../domain/survey/survey.repository.js";
import type { IQuestionRepository } from "../../../domain/question/question.repository.js";
import type { ILogicRuleRepository } from "../../../domain/logic-rule/logic-rule.repository.js";
import type { ISurveyStatsRepository } from "../../../domain/survey-stats/survey-stats.repository.js";
import type { IQuestionStatsRepository } from "../../../domain/question-stats/question-stats.repository.js";
import type { ITransactionalRepository } from "./transactional-repository.js";
import type { IUserRepository } from "../../../domain/user/user.repository.js";
import type { IRefreshTokenRepository } from "../../../domain/refresh-token/refresh-token.repository.js";
import type { IVerificationTokenRepository } from "../../../domain/verification-token/verification-token.repository.js";

export class MongoUnitOfWork implements IUnitOfWork {
  constructor(
    public readonly auth: {
      userRepository: IUserRepository & ITransactionalRepository;
      verificationTokenRepository: IVerificationTokenRepository &
        ITransactionalRepository;
      refreshTokenRepository: IRefreshTokenRepository &
        ITransactionalRepository;
    },
    public readonly survey: {
      surveyRepository: ISurveyRepository & ITransactionalRepository;
      questionRepository: IQuestionRepository & ITransactionalRepository;
      logicRuleRepository: ILogicRuleRepository & ITransactionalRepository;
      surveyStatsRepository: ISurveyStatsRepository & ITransactionalRepository;
      questionStatsRepository: IQuestionStatsRepository &
        ITransactionalRepository;
      answerRepository: IAnswerRepository & ITransactionalRepository;
      responseSessionRepository: IResponseSessionRepository &
        ITransactionalRepository;
    }
  ) {}

  async execute<T>(work: (unitOfWork: this) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();

    this.applySession(session);

    try {
      session.startTransaction();

      const result = await work(this);

      await session.commitTransaction();

      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();

      this.clearSession();
    }
  }

  private applySession(session: ClientSession) {
    this.auth.userRepository.setSession(session);
    this.auth.verificationTokenRepository.setSession(session);
    this.auth.refreshTokenRepository.setSession(session);

    this.survey.surveyRepository.setSession(session);
    this.survey.questionRepository.setSession(session);
    this.survey.logicRuleRepository.setSession(session);
    this.survey.surveyStatsRepository.setSession(session);
    this.survey.questionStatsRepository.setSession(session);
    this.survey.answerRepository.setSession(session);
    this.survey.responseSessionRepository.setSession(session);
  }

  private clearSession() {
    this.auth.userRepository.clearSession();
    this.auth.verificationTokenRepository.clearSession();
    this.auth.refreshTokenRepository.clearSession();

    this.survey.surveyRepository.clearSession();
    this.survey.questionRepository.clearSession();
    this.survey.logicRuleRepository.clearSession();
    this.survey.surveyStatsRepository.clearSession();
    this.survey.questionStatsRepository.clearSession();
    this.survey.answerRepository.clearSession();
    this.survey.responseSessionRepository.clearSession();
  }
}
