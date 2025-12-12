import type { SurveyStatsEntity } from "./survey-stats.entity.js";

export interface ISurveyStatsRepository {
  create(stats: SurveyStatsEntity): Promise<SurveyStatsEntity>;
  findBySurveyId(surveyId: string): Promise<SurveyStatsEntity | null>;
  update(stats: SurveyStatsEntity): Promise<SurveyStatsEntity>
}
