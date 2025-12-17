export interface SurveyStatsProps {
  id: string;
  surveyId: string;
  avgCompletionTime?: number;
  minCompletionTime?: number;
  maxCompletionTime?: number;
  abandonmentRate?: number;
  totalResponses?: number;
  totalAbandoned?: number;
}

export class SurveyStatsEntity {
  private constructor(
    public readonly id: string,
    public readonly surveyId: string,
    public avgCompletionTime: number,
    public minCompletionTime: number,
    public maxCompletionTime: number,
    public abandonmentRate: number,
    public totalResponses: number,
    public totalAbandoned: number
  ) {}

  public updateCompletionTime(seconds: number) {
    this.minCompletionTime = Math.min(this.minCompletionTime, seconds);
    this.maxCompletionTime = Math.max(this.maxCompletionTime, seconds);

    this.avgCompletionTime =
      (this.avgCompletionTime * this.totalResponses + seconds) /
      (this.totalResponses + 1);

    this.totalResponses++;
    this.calculateAbandonmentRate();
  }

  private calculateAbandonmentRate() {
    const totalStarted = this.totalResponses + this.totalAbandoned;

    if (totalStarted === 0) {
      this.abandonmentRate = 0;
      return;
    }

    this.abandonmentRate = (this.totalAbandoned / totalStarted) * 100;
  }

  public registerAbandonment() {
    this.totalAbandoned++;
    this.calculateAbandonmentRate();
  }

  static create({
    id,
    surveyId,
    avgCompletionTime = 0,
    minCompletionTime = Number.POSITIVE_INFINITY,
    maxCompletionTime = 0,
    abandonmentRate = 0,
    totalResponses = 0,
    totalAbandoned = 0,
  }: SurveyStatsProps): SurveyStatsEntity {
    return new SurveyStatsEntity(
      id,
      surveyId,
      avgCompletionTime,
      minCompletionTime,
      maxCompletionTime,
      abandonmentRate,
      totalResponses,
      totalAbandoned
    );
  }
}
