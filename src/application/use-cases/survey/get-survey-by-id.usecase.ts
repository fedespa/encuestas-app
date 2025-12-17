import type { ILogicRuleRepository } from "../../../domain/logic-rule/logic-rule.repository.js";
import type { IQuestionRepository } from "../../../domain/question/question.repository.js";
import { SurveyNotFoundError, SurveyWithoutQuestions } from "../../../domain/survey/survey.errors.js";
import type { ISurveyRepository } from "../../../domain/survey/survey.repository.js";
import { LogicRuleVmMappeer } from "../../mappers/logic-rule/logic-rule.vm.mapper.js";
import { QuestionVmMapper } from "../../mappers/question/question.vm.mapper.js";
import { SurveyVmMapper } from "../../mappers/survey/survey.vm.mapper.js";
import type { SurveyWithDetailsVm } from "../../view-models/survey/survey-with-details.vm.js";

export class GetSurveyByIdUseCase {
    constructor (
        private readonly surveyRepository: ISurveyRepository,
        private readonly questionRepository: IQuestionRepository,
        private readonly logicRuleRepository: ILogicRuleRepository
    ){}

    async execute(id: string): Promise<SurveyWithDetailsVm | null> {
        const survey = await this.surveyRepository.findById(id);

        if (!survey) {
            throw new SurveyNotFoundError();
        }

        const questions = await this.questionRepository.findBySurveyId(id);

        if (questions.length < 1) {
            throw new SurveyWithoutQuestions();
        }

        const rules = await this.logicRuleRepository.findBySurveyId(id);

        return {
            survey: SurveyVmMapper.toSurveyVm(survey),
            questions: questions.map(q => QuestionVmMapper.toQuestionVm(q)),
            rules: rules.map(r => LogicRuleVmMappeer.toLogicRuleVm(r))
        }

    }
}