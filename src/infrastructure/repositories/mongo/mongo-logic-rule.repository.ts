import type { ClientSession } from "mongoose";
import { LogicRuleEntity } from "../../../domain/logic-rule/logic-rule.entity.js";
import type { ILogicRuleRepository } from "../../../domain/logic-rule/logic-rule.repository.js";
import { LogicRuleModel } from "../../db/mongo/logic-rule.model.js";
import { LogicRulePersistenceMapper } from "../../mappers/logic-rule.persistence.mapper.js";

export class MongoLogicRuleRepository implements ILogicRuleRepository {
  private session: ClientSession | null = null;

  setSession(session: ClientSession) {
    this.session = session;
  }

  clearSession() {
    this.session = null;
  }

  async create(logicRule: LogicRuleEntity): Promise<LogicRuleEntity> {
    const persistence = LogicRulePersistenceMapper.toPersistence(logicRule);
    await LogicRuleModel.create([persistence], { session: this.session });

    return logicRule;
  }

  async createMany(logicRules: LogicRuleEntity[]): Promise<LogicRuleEntity[]> {
    const persistenceList = logicRules.map((l) =>
      LogicRulePersistenceMapper.toPersistence(l)
    );

    await LogicRuleModel.insertMany(persistenceList, { session: this.session });

    return logicRules;
  }

  async findBySurveyId(surveyId: string): Promise<LogicRuleEntity[]> {
    const docs = await LogicRuleModel.find({ surveyId }).lean();

    return docs.map((doc) => LogicRulePersistenceMapper.toEntity(doc));
  }

  async deleteMany(ids: string[]): Promise<void> {
    await LogicRuleModel.deleteMany({ _id: { $in: ids } });
  }
}
