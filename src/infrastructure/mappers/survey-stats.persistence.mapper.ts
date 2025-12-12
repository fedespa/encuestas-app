import { SurveyStatsEntity } from "../../domain/survey-stats/survey-stats.entity.js";

export class SurveyStatsPersistenceMapper {
  static toEntity(doc: any): SurveyStatsEntity {
    return SurveyStatsEntity.create({
      id: doc._id,
      surveyId: doc.surveyId,
      avgCompletionTime: doc.avgCompletionTime,
      minCompletionTime: doc.minCompletionTime,
      maxCompletionTime: doc.maxCompletionTime,
      abandonmentRate: doc.abandonmentRate,
      totalResponses: doc.totalResponses,
      totalAbandoned: doc.totalAbandoned,
    });
  }

  static toPersistence(entity: SurveyStatsEntity) {
    return {
      _id: entity.id,
      surveyId: entity.surveyId,
      avgCompletionTime: entity.avgCompletionTime,
      minCompletionTime: entity.minCompletionTime,
      maxCompletionTime: entity.maxCompletionTime,
      abandonmentRate: entity.abandonmentRate,
      totalResponses: entity.totalResponses,
      totalAbandoned: entity.totalAbandoned,
    };
  }
}
