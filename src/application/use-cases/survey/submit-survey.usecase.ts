import { AnswerEntity } from "../../../domain/answer/answer.entity.js";
import { AnswerNotFoundForQuestionError } from "../../../domain/answer/answer.errors.js";
import type { ILogicRuleRepository } from "../../../domain/logic-rule/logic-rule.repository.js";
import { QuestionStatsCountMismatchError } from "../../../domain/question-stats/question-stats.errors.js";
import type { IQuestionStatsRepository } from "../../../domain/question-stats/question-stats.repository.js";
import type { IQuestionRepository } from "../../../domain/question/question.repository.js";
import {
  ResponseSessionNotFoundError,
  SessionAlreadyFinishedError,
  SessionDoesNotAllowAnonymousError,
  SessionHasNoUserError,
  SessionUserMismatchError,
} from "../../../domain/response-session/response-session-errors.js";
import type { IResponseSessionRepository } from "../../../domain/response-session/response-session.repository.js";
import { SurveyStatsNotFoundError } from "../../../domain/survey-stats/survey-stats.errors.js";
import type { ISurveyStatsRepository } from "../../../domain/survey-stats/survey-stats.repository.js";
import { SurveyNotFoundError } from "../../../domain/survey/survey.errors.js";
import type { ISurveyRepository } from "../../../domain/survey/survey.repository.js";
import { SurveyResponseValidator } from "../../../domain/survey/validation/survey-response.validator.js";
import type { ILoggerService } from "../../services/logger.service.js";
import type { TokenService } from "../../services/token.service.js";
import type { IUnitOfWork } from "../../services/unit-of-work.js";

interface SubmitSurveyInput {
  sessionId: string;
  answers: {
    questionId: string;
    value: any;
  }[];
  user: {
    userId: string;
  } | null;
}

export class SubmitSurveyUseCase {
  constructor(
    private readonly responseSessionRepository: IResponseSessionRepository,
    private readonly questionRepository: IQuestionRepository,
    private readonly logicRuleRepository: ILogicRuleRepository,
    private readonly tokenService: TokenService,
    private readonly surveyStatsRepository: ISurveyStatsRepository,
    private readonly questionStatsRepository: IQuestionStatsRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly surveyRepository: ISurveyRepository,
    private readonly logger: ILoggerService
  ) {}

  async execute({ sessionId, answers, user }: SubmitSurveyInput) {
    this.logger.info("Inicio de submit de encuesta", {
      sessionId,
      userId: user?.userId,
      answersCount: answers.length,
    });

    const session = await this.responseSessionRepository.findById(sessionId);

    if (!session) {
      this.logger.warn("Submit fallido: sesión no encontrada", { sessionId });
      throw new ResponseSessionNotFoundError();
    }

    if (session.isFinished()) {
      this.logger.warn("Submit fallido: sesión ya finalizada", { sessionId });
      throw new SessionAlreadyFinishedError();
    }

    const survey = await this.surveyRepository.findById(session.surveyId);

    if (!survey) {
      this.logger.warn("Submit fallido: encuesta no encontrada", {
        surveyId: session.surveyId,
        sessionId,
      });
      throw new SurveyNotFoundError();
    }

    if (user) {
      if (!session.userId) {
        throw new SessionHasNoUserError();
      } else if (user.userId != session.userId) {
        throw new SessionUserMismatchError();
      }
    } else {
      if (session.userId) {
        throw new SessionDoesNotAllowAnonymousError();
      }
    }

    const [questions, rules] = await Promise.all([
      await this.questionRepository.findBySurveyId(session.surveyId),
      await this.logicRuleRepository.findBySurveyId(session.surveyId),
    ]);

    SurveyResponseValidator.validateSurveyResponse(questions, answers, rules);

    const answersEntities = answers.map((a) =>
      AnswerEntity.create({
        id: this.tokenService.generateUUID(),
        sessionId,
        questionId: a.questionId,
        value: a.value,
      })
    );

    session.finishSession();

    const time = session.getCompletionTimeInSeconds();

    if (!time) {
      throw new SessionAlreadyFinishedError();
    }

    const answeredQuestionIds = answers.map((a) => a.questionId);

    const [surveyStats, questionsStats] = await Promise.all([
      await this.surveyStatsRepository.findBySurveyId(session.surveyId),
      await this.questionStatsRepository.findByQuestionIds(answeredQuestionIds),
    ]);

    if (!surveyStats) {
      throw new SurveyStatsNotFoundError();
    }

    surveyStats.updateCompletionTime(time);

    if (questionsStats.length !== answers.length) {
      throw new QuestionStatsCountMismatchError();
    }

    for (const stat of questionsStats) {
      const answer = answers.find((a) => a.questionId === stat.questionId);

      if (!answer) {
        throw new AnswerNotFoundForQuestionError();
      }

      stat.registerAnswer(answer.value);
    }

    await this.unitOfWork.execute(async (unitOfWork) => {
      await unitOfWork.survey.surveyStatsRepository.update(surveyStats);
      await unitOfWork.survey.questionStatsRepository.updateMany(
        questionsStats
      );
      await unitOfWork.survey.answerRepository.createMany(answersEntities);
      await unitOfWork.survey.responseSessionRepository.update(
        session.id,
        session
      );
    });

    this.logger.info("Encuesta completada correctamente", {
      sessionId,
      surveyId: session.surveyId,
      userId: session.userId,
      completionTimeSeconds: time,
      answersCount: answers.length,
    });
  }
}
