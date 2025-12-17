import { SurveyStatsEntity } from "../../../domain/survey-stats/survey-stats.entity.js";
import type { SurveyStatsVm } from "../../view-models/survey-stats/survey-stats.vm.js";

export class SurveyStatsVmMapper {
  static toSurveyStatsVm(entity: SurveyStatsEntity): SurveyStatsVm {
    return {
      avgCompletionTime: entity.avgCompletionTime,
      minCompletionTime: entity.minCompletionTime,
      maxCompletionTime: entity.maxCompletionTime,
      abandonmentRate: entity.abandonmentRate,
      totalResponses: entity.totalResponses,
      totalAbandoned: entity.totalAbandoned,
    };
  }
}
