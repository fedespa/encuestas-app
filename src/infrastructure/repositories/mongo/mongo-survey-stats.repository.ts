import type { ClientSession } from "mongoose";
import type { SurveyStatsEntity } from "../../../domain/survey-stats/survey-stats.entity.js";
import type { ISurveyStatsRepository } from "../../../domain/survey-stats/survey-stats.repository.js";
import { SurveyStatsModel } from "../../db/mongo/survey-stats.model.js";
import { SurveyStatsPersistenceMapper } from "../../mappers/survey-stats.persistence.mapper.js";

export class MongoSurveyStatsRepository implements ISurveyStatsRepository {
  private session: ClientSession | null = null;

  setSession(session: ClientSession) {
    this.session = session;
  }

  clearSession() {
    this.session = null;
  }

  async create(stats: SurveyStatsEntity): Promise<SurveyStatsEntity> {
    const persistence = SurveyStatsPersistenceMapper.toPersistence(stats);
    await SurveyStatsModel.create([persistence], { session: this.session });
    return stats;
  }
  async findBySurveyId(surveyId: string): Promise<SurveyStatsEntity | null> {
    const survey = await SurveyStatsModel.findOne({ surveyId });

    if (!survey) return null;

    return SurveyStatsPersistenceMapper.toEntity(survey);
  }
  async update(stats: SurveyStatsEntity): Promise<SurveyStatsEntity> {
    const persistence = SurveyStatsPersistenceMapper.toPersistence(stats);

    const options = this.session ? { session: this.session } : {};

    await SurveyStatsModel.updateOne(
      { _id: stats.id },
      persistence,
      options
    );

    return stats;
  }
}
