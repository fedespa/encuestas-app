import { LogicRuleEntity } from "../../../domain/logic-rule/logic-rule.entity.js";
import type { ILogicRuleRepository } from "../../../domain/logic-rule/logic-rule.repository.js";
import type {
  ConditionOperator,
  LogicAction,
} from "../../../domain/logic-rule/logic-rule.types.js";
import { QuestionEntity } from "../../../domain/question/question.entity.js";
import type { IQuestionRepository } from "../../../domain/question/question.repository.js";
import type {
  QuestionOptions,
  QuestionType,
} from "../../../domain/question/question.types.js";
import { SurveyEntity } from "../../../domain/survey/survey.entity.js";
import { PrivateSurveyRequiresLoginError } from "../../../domain/survey/survey.errors.js";
import type { ISurveyRepository } from "../../../domain/survey/survey.repository.js";
import type { IUserRepository } from "../../../domain/user/user.repository.js";
import type { TokenService } from "../../services/token.service.js";

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
  } | null
}

export class CreateSurveyUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
    private readonly surveyRepository: ISurveyRepository,
    private readonly questionRepository: IQuestionRepository,
    private readonly logicRuleRepository: ILogicRuleRepository
  ) {}

  async execute(input: CreateSurveyInputDTO) {
    const { user } = input;

    if (!user && !input.survey.isPublic) {
      throw new PrivateSurveyRequiresLoginError();
    }

    const survey = SurveyEntity.create({
      ...input.survey,
      id: this.tokenService.generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: user ? user.userId : undefined
    });

    const questionIdMap = new Map<string, string>();
    for (const q of input.questions) {
      const id = this.tokenService.generateUUID();
      questionIdMap.set(q.tempId, id);
    }

    const questions = input.questions.map((q) =>
      QuestionEntity.create({
        ...q,
        surveyId: survey.getId(),
        id: questionIdMap.get(q.tempId)!!,
      })
    );

    const logicRules = input.logicRules.map((l) =>
      LogicRuleEntity.create({
        ...l,
        id: this.tokenService.generateUUID(),
        surveyId: survey.getId(),
        sourceQuestionId: questionIdMap.get(l.sourceTempId)!!,
        targetQuestionId: questionIdMap.get(l.targetTempId)!!,
      })
    );

    await this.surveyRepository.create(survey);

    const questionIds = questions.map((q) => q.getId());

    try {
      await this.questionRepository.createMany(questions);
    } catch (error) {
      await this.surveyRepository.delete(survey.getId());
      await this.questionRepository.deleteMany(questionIds);
      throw (error)
    }

    try {
      await this.logicRuleRepository.createMany(logicRules);
    } catch (error) {
      await this.surveyRepository.delete(survey.getId());
      await this.questionRepository.deleteMany(questionIds);
      throw (error)
    }

    return 12;
  }
}
