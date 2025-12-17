export interface SurveyStatsVm {
  avgCompletionTime: number;
  minCompletionTime: number;
  maxCompletionTime: number;
  abandonmentRate: number;
  totalResponses: number;
  totalAbandoned: number;
}