import { LogicRuleEntity } from "../../../domain/logic-rule/logic-rule.entity.js";
import type { ILogicRuleRepository } from "../../../domain/logic-rule/logic-rule.repository.js";
import { LogicRuleModel } from "../../db/mongo/logic-rule.model.js";
import { LogicRulePersistenceMapper } from "../../mappers/logic-rule.persistence.mapper.js";

export class MongoLogicRuleRepository implements ILogicRuleRepository {
  async create(logicRule: LogicRuleEntity): Promise<LogicRuleEntity> {
    const persistence = LogicRulePersistenceMapper.toPersistence(logicRule);
    await LogicRuleModel.create(persistence);

    return logicRule;
  }
}
