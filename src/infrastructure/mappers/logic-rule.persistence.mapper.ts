import { LogicRuleEntity } from "../../domain/logic-rule/logic-rule.entity.js";

export class LogicRulePersistenceMapper {
  static toEntity(doc: any): LogicRuleEntity {
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

  static toPersistence(entity: LogicRuleEntity) {
    return {
      _id: entity.getId(),
      surveyId: entity.getSurveyId(),
      sourceQuestionId: entity.getSourceQuestionId(),
      operator: entity.getOperator(),
      value: entity.getValue(),
      action: entity.getAction(),
      targetQuestionId: entity.getTargetQuestionId(),
    };
  }
}
