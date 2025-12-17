export interface QuestionStatsProps {
  id: string;
  questionId: string;
  optionCounts?: Map<string, number>;
  abandonCount?: number;
  answerCount?: number;
}

export class QuestionStatsEntity {
  private constructor(
    public readonly id: string,
    public readonly questionId: string,
    public optionCounts: Map<string, number>,
    public abandonCount: number = 0,
    public answerCount: number = 0
  ) {}

  public registerAnswer(value: any) {
    if (Array.isArray(value)) {
      value.forEach((v) => this.incrementOption(v));
    } else {
      this.incrementOption(value);
    }
    this.answerCount++;
  }

  private incrementOption(option: string) {
    const current = this.optionCounts.get(option) ?? 0;
    this.optionCounts.set(option, current + 1);
  }

  public registerAbandonment() {
    this.abandonCount++;
  }

  static create({
    id,
    questionId,
    optionCounts = new Map(),
    abandonCount = 0,
    answerCount = 0,
  }: QuestionStatsProps) {
    return new QuestionStatsEntity(
      id,
      questionId,
      optionCounts,
      abandonCount,
      answerCount
    );
  }
}
