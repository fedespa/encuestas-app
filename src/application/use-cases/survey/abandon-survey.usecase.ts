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
import { SurveyResponseValidator } from "../../../domain/survey/validation/survey-response.validator.js";
import type { ILoggerService } from "../../services/logger.service.js";
import type { IUnitOfWork } from "../../services/unit-of-work.js";

export interface AbandonSurveyUseCaseDTO {
  sessionId: string;
  user: { userId: string } | null;
  answers: {
    questionId: string;
    value: any;
  }[];
}

export class AbandonSurveyUseCase {
  constructor(
    private readonly responseSessionRepository: IResponseSessionRepository,
    private readonly questionRepository: IQuestionRepository,
    private readonly logicRulesRepository: ILogicRuleRepository,
    private readonly surveyStatsRepository: ISurveyStatsRepository,
    private readonly questionStatsRepository: IQuestionStatsRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly logger: ILoggerService
  ) {}

  async execute({ sessionId, answers, user }: AbandonSurveyUseCaseDTO) {
    this.logger.info("Inicio de abandono de encuesta", {
      sessionId,
      userId: user?.userId,
      answersCount: answers.length,
    });

    const session = await this.responseSessionRepository.findById(sessionId);

    if (!session) {
      throw new ResponseSessionNotFoundError();
    }

    if (session.isFinished()) {
      throw new SessionAlreadyFinishedError();
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
      await this.logicRulesRepository.findBySurveyId(session.surveyId),
    ]);

    SurveyResponseValidator.validatePartialResponse(questions, answers, rules);

    const abandonedAtQuestion = SurveyResponseValidator.getAbandonedQuestion(
      answers,
      questions,
      rules
    );

    if (!abandonedAtQuestion) {
      this.logger.error(
        "Estado inconsistente: no se pudo determinar abandono",
        {
          sessionId,
          answersCount: answers.length,
        }
      );
      throw new Error("Estado inconsistente");
    }

    session.abandonAt(abandonedAtQuestion.id);

    const answeredQuestionIds = Array.from(
      new Set([...answers.map((a) => a.questionId), abandonedAtQuestion.id])
    );

    const [surveyStats, questionsStats] = await Promise.all([
      await this.surveyStatsRepository.findBySurveyId(session.surveyId),
      await this.questionStatsRepository.findByQuestionIds(answeredQuestionIds),
    ]);

    if (!surveyStats) {
      throw new SurveyStatsNotFoundError();
    }

    surveyStats.registerAbandonment();

    if (questionsStats.length !== answeredQuestionIds.length) {
      throw new QuestionStatsCountMismatchError();
    }

    for (const stat of questionsStats) {
      if (stat.questionId === abandonedAtQuestion.id) {
        stat.registerAbandonment();
        continue;
      }

      const answer = answers.find((a) => a.questionId === stat.questionId);

      if (!answer) {
        throw new AnswerNotFoundForQuestionError();
      }

      stat.registerAnswer(answer.value);
    }

    await this.unitOfWork.execute(async (unitOfWork) => {
      await unitOfWork.survey.responseSessionRepository.update(
        session.id,
        session
      );
      await unitOfWork.survey.surveyStatsRepository.update(surveyStats);
      await unitOfWork.survey.questionStatsRepository.updateMany(
        questionsStats
      );
    });

    this.logger.info("Encuesta abandonada correctamente", {
      sessionId,
      surveyId: session.surveyId,
      abandonedAtQuestionId: abandonedAtQuestion.id,
      userId: session.userId,
    });
  }
}
