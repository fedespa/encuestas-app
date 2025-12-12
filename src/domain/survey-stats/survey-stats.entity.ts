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

    // Calcular nuevo promedio
    this.avgCompletionTime =
      (this.avgCompletionTime * this.totalResponses + seconds) /
      (this.totalResponses + 1);

    this.totalResponses++;
  }

  public registerAbandonment() {
    this.totalAbandoned++;
    this.abandonmentRate =
      (this.totalAbandoned / (this.totalResponses + this.totalAbandoned)) * 100;
  }

  static create({
    id,
    surveyId,
    avgCompletionTime = 0,
    minCompletionTime = 0,
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

