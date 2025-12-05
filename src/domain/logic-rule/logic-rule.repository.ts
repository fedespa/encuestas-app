import type { LogicRuleEntity } from "./logic-rule.entity.js";

export interface ILogicRuleRepository {
    create(logicRule: LogicRuleEntity): Promise<LogicRuleEntity>
}