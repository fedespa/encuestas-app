import { LogicRuleEntity } from "../../../domain/logic-rule/logic-rule.entity.js";
import type {
  ConditionOperator,
  LogicAction,
} from "../../../domain/logic-rule/logic-rule.types.js";
import { QuestionStatsEntity } from "../../../domain/question-stats/question-stats.entity.js";
import { QuestionEntity } from "../../../domain/question/question.entity.js";
import type {
  QuestionOptions,
  QuestionType,
} from "../../../domain/question/question.types.js";
import { SurveyStatsEntity } from "../../../domain/survey-stats/survey-stats.entity.js";
import { SurveyEntity } from "../../../domain/survey/survey.entity.js";
import {
  PrivateSurveyRequiresLoginError,
  SurveyCreationError,
} from "../../../domain/survey/survey.errors.js";
import { SurveyCreationValidator } from "../../../domain/survey/validation/survey-creation.validator.js";
import { SurveyVmMapper } from "../../mappers/survey/survey.vm.mapper.js";
import type { TokenService } from "../../services/token.service.js";
import type { IUnitOfWork } from "../../services/unit-of-work.js";
import type { CreatedSurveyVm } from "../../view-models/survey/created-survey.vm.js";

export interface CreateSurveyInputDTO {
  survey: {
    title: string;
    description: string;
    isPublic: boolean;
  };
  questions: {
    tempId: string;
    type: QuestionType;
    questionText: string;
    required: boolean;
    options: QuestionOptions;
    order: number;
  }[];
  logicRules: {
    sourceTempId: string;
    operator: ConditionOperator;
    value: any;
    action: LogicAction;
    targetTempId: string;
  }[];
  user: {
    userId: string;
  } | null;
}

export class CreateSurveyUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  async execute(input: CreateSurveyInputDTO): Promise<CreatedSurveyVm> {
    const { user } = input;

    if (!user && !input.survey.isPublic) {
      throw new PrivateSurveyRequiresLoginError();
    }

    this.assertNoDuplicateQuestionTempIds(input.questions);
    this.assertRulesReferenceExistingTempIds(input.questions, input.logicRules);

    if (input.questions.length < 2 && input.logicRules.length > 0) {
      throw new SurveyCreationError(
        "No se pueden definir reglas con menos de dos preguntas."
      );
    }

    const survey = SurveyEntity.create({
      ...input.survey,
      id: this.tokenService.generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: user ? user.userId : undefined,
    });

    const questionIdMap = new Map<string, string>();
    for (const q of input.questions) {
      const id = this.tokenService.generateUUID();
      questionIdMap.set(q.tempId, id);
    }

    const questions = input.questions.map((q) =>
      QuestionEntity.create({
        ...q,
        surveyId: survey.id,
        id: questionIdMap.get(q.tempId)!!,
      })
    );

    const logicRules = input.logicRules.map((l) =>
      LogicRuleEntity.create({
        ...l,
        id: this.tokenService.generateUUID(),
        surveyId: survey.id,
        sourceQuestionId: questionIdMap.get(l.sourceTempId)!!,
        targetQuestionId: questionIdMap.get(l.targetTempId)!!,
      })
    );

    const orderedRules = SurveyCreationValidator.validateSurveyCreation(
      questions,
      logicRules
    );

    const stats = SurveyStatsEntity.create({
      id: this.tokenService.generateUUID(),
      surveyId: survey.id,
    });

    const questionsStats: QuestionStatsEntity[] = [];

    for (const q of questions) {
      const question = QuestionStatsEntity.create({
        id: this.tokenService.generateUUID(),
        questionId: q.id,
      });

      questionsStats.push(question);
    }

    await this.unitOfWork.execute(async (unitOfWork) => {
      await unitOfWork.survey.surveyRepository.create(survey);
      await unitOfWork.survey.questionRepository.createMany(questions);

      await unitOfWork.survey.logicRuleRepository.createMany(orderedRules);

      await unitOfWork.survey.surveyStatsRepository.create(stats);

      await unitOfWork.survey.questionStatsRepository.createMany(
        questionsStats
      );
    });

    return {
      survey: SurveyVmMapper.toSurveyVm(survey),
      questions,
      logicRules: orderedRules,
    };
  }

  private assertNoDuplicateQuestionTempIds(
    questions: CreateSurveyInputDTO["questions"]
  ) {
    const seen = new Set<string>();

    for (const q of questions) {
      if (seen.has(q.tempId)) {
        throw new SurveyCreationError(
          "Ids temporales de las preguntas repetidos. "
        );
      }
      seen.add(q.tempId);
    }
  }

  private assertRulesReferenceExistingTempIds(
    questions: CreateSurveyInputDTO["questions"],
    rules: CreateSurveyInputDTO["logicRules"]
  ) {
    const tempIds = new Set(questions.map((q) => q.tempId));

    for (const rule of rules) {
      if (!tempIds.has(rule.sourceTempId)) {
        throw new SurveyCreationError(
          `La regla hace referencia a una pregunta origen inexistente: ${rule.sourceTempId}`
        );
      }
      if (!tempIds.has(rule.targetTempId)) {
        throw new SurveyCreationError(
          `La regla hace referencia a una pregunta destino inexistente: ${rule.targetTempId}`
        );
      }
    }
  }
}
