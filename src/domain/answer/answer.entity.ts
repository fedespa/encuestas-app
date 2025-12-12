export interface AnswerProps {
  id: string;
  sessionId: string;
  questionId: string;
  value: any;
}

export class AnswerEntity {
  private constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly questionId: string,
    public value: any, 
  ) {}

  static create(props: AnswerProps) {
    return new AnswerEntity(
      props.id,
      props.sessionId,
      props.questionId,
      props.value,
    );
  }
}
