import type { IQuestionStatsRepository } from "../../../domain/question-stats/question-stats.repository.js";
import type { IQuestionRepository } from "../../../domain/question/question.repository.js";
import {
  InconsistentSurveyStatsError,
  PrivateSurveyStatsError,
  SurveyStatsNotFoundError,
} from "../../../domain/survey-stats/survey-stats.errors.js";
import type { ISurveyStatsRepository } from "../../../domain/survey-stats/survey-stats.repository.js";
import {
  SurveyNotFoundError,
  SurveyWithoutQuestions,
} from "../../../domain/survey/survey.errors.js";
import type { ISurveyRepository } from "../../../domain/survey/survey.repository.js";
import { QuestionStatsVmMapper } from "../../mappers/question-stats/question-stats.vm.mapper.js";
import { SurveyStatsVmMapper } from "../../mappers/survey-stats/survey-stats.vm.mapper.js";
import { SurveyVmMapper } from "../../mappers/survey/survey.vm.mapper.js";
import type { SurveyWithStatsVm } from "../../view-models/survey/survey-with-stats.vm.js";

export class GetSurveyStatsByIdUseCase {
  constructor(
    private readonly surveyRepository: ISurveyRepository,
    private readonly surveyStatsRepository: ISurveyStatsRepository,
    private readonly questionsStatsRepository: IQuestionStatsRepository,
    private readonly questionRepository: IQuestionRepository
  ) {}

  async execute(
    id: string,
    user: { userId: string } | null
  ): Promise<SurveyWithStatsVm> {
    const survey = await this.surveyRepository.findById(id);

    if (!survey) {
      throw new SurveyNotFoundError();
    }

    if (!survey.isPublic && !user) {
      throw new PrivateSurveyStatsError();
    }

    if (!survey.isPublic && user) {
      if (survey.ownerId !== user.userId) {
        throw new PrivateSurveyStatsError();
      }
    }

    const surveyStats = await this.surveyStatsRepository.findBySurveyId(id);

    if (!surveyStats) {
      throw new SurveyStatsNotFoundError();
    }

    const questions = await this.questionRepository.findBySurveyId(id);

    if (questions.length < 1) {
      throw new SurveyWithoutQuestions();
    }

    const questionIds = questions.map((q) => q.id);

    const questionsStats =
      await this.questionsStatsRepository.findByQuestionIds(questionIds);

    if (questionsStats.length !== questionIds.length) {
      throw new InconsistentSurveyStatsError();
    }

    return {
      survey: SurveyVmMapper.toSurveyVm(survey),
      stats: SurveyStatsVmMapper.toSurveyStatsVm(surveyStats),
      questions: questionsStats.map((qs) =>
        QuestionStatsVmMapper.toQuestionStatsVm(qs)
      ),
    };
  }
}
