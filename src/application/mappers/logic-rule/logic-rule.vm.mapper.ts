import type { LogicRuleEntity } from "../../../domain/logic-rule/logic-rule.entity.js";
import type { LogicRuleVm } from "../../view-models/logic-rule/logic-rule.vm.js";

export class LogicRuleVmMappeer {
    static toLogicRuleVm(entity: LogicRuleEntity): LogicRuleVm{
        return {
            id: entity.id,
            sourceQuestionId: entity.sourceQuestionId,
            operator: entity.operator,
            value: entity.value,
            action: entity.action,
            targetQuestionId: entity.targetQuestionId
        }
    }
}