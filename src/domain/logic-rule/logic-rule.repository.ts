import type { LogicRuleEntity } from "./logic-rule.entity.js";

export interface ILogicRuleRepository {
    create(logicRule: LogicRuleEntity): Promise<LogicRuleEntity>
    createMany(logicRules: LogicRuleEntity[]): Promise<LogicRuleEntity[]>;
    findBySurveyId(surveyId: string): Promise<LogicRuleEntity[]>;
    deleteMany(ids: string[]): Promise<void>;
}