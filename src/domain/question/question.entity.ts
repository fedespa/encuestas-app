import type { QuestionOptions, QuestionType } from "./question.types.js";

export class QuestionEntity {
  private constructor(
    public readonly id: string,
    public surveyId: string,
    public type: QuestionType,
    public questionText: string,
    public required: boolean,
    public options: QuestionOptions,
    public order: number
  ) {}

  static create(props: {
    id: string;
    surveyId: string;
    type: QuestionType;
    questionText: string;
    required: boolean;
    options: QuestionOptions;
    order: number;
  }) {
    return new QuestionEntity(
      props.id,
      props.surveyId,
      props.type,
      props.questionText,
      props.required,
      props.options,
      props.order
    );
  }
}

