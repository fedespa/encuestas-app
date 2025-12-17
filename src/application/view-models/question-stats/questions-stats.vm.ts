export interface QuestionStatsVm {
  questionId: string;
  totalResponses: number;
  totalAbandoned: number;
  distribution: Record<string, number>;
}
