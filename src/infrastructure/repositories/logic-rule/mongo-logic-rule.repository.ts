import { LogicRuleEntity } from "../../../domain/logic-rule/logic-rule.entity.js";
import type { ILogicRuleRepository } from "../../../domain/logic-rule/logic-rule.repository.js";
import { LogicRuleModel } from "../../db/mongo/logic-rule.model.js";

export class MongoLogicRuleRepository implements ILogicRuleRepository {
  async create(logicRule: LogicRuleEntity): Promise<LogicRuleEntity> {
    const doc = await LogicRuleModel.create({
      _id: logicRule.id,
      surveyId: logicRule.surveyId,
      sourceQuestionId: logicRule.sourceQuestionId,
      operator: logicRule.operator,
      value: logicRule.value,
      action: logicRule.action,
      targetQuestionId: logicRule.targetQuestionId,
    });

    return LogicRuleEntity.create({
      id: doc._id,
      surveyId: doc.surveyId,
      sourceQuestionId: doc.sourceQuestionId,
      operator: doc.operator,
      value: doc.value,
      action: doc.action,
      targetQuestionId: doc.targetQuestionId,
    });
  }
}
