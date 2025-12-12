interface ResponseSessionEntityProps {
  id: string;
  surveyId: string;
  userId: string | null;
  startedAt: Date;
  finishedAt: Date | undefined;
  abandonedAtQuestionId: string | undefined;
}

export class ResponseSessionEntity {
  private constructor(
    public readonly id: string,
    public readonly surveyId: string,
    public readonly userId: string | null,
    public readonly startedAt: Date,
    public finishedAt?: Date,
    public abandonedAtQuestionId?: string
  ) {}

  finishSession() {
    this.finishedAt = new Date();
  }

  abandonAt(questionId: string) {
    this.abandonedAtQuestionId = questionId;
    this.finishedAt = new Date();
  }

  isFinished(): boolean {
    return this.finishedAt !== undefined;
  }

  getCompletionTimeInSeconds(): number | null {
    if (!this.finishedAt) return null;
    const diffMs = this.finishedAt.getTime() - this.startedAt.getTime();
    return diffMs / 1000;
  }

  static create(props: ResponseSessionEntityProps) {
    return new ResponseSessionEntity(
      props.id,
      props.surveyId,
      props.userId,
      props.startedAt,
      props.finishedAt,
      props.abandonedAtQuestionId
    );
  }
}
