import type { QuestionOptions, QuestionType } from "./question.types.js";

export interface QuestionProps {
  id: string;
  surveyId: string;
  type: QuestionType;
  questionText: string;
  required: boolean;
  options: QuestionOptions;
  order: number;
}

export class QuestionEntity {
  private constructor(
    private readonly id: string,
    private surveyId: string,
    private type: QuestionType,
    private questionText: string,
    private required: boolean,
    private options: QuestionOptions,
    private order: number
  ) {}

  getId() {
    return this.id;
  }
  getSurveyId() {
    return this.surveyId;
  }
  getType() {
    return this.type;
  }
  getQuestionText() {
    return this.questionText;
  }
  getRequired() {
    return this.required;
  }
  getOptions() {
    return this.options;
  }
  getOrder() {
    return this.order;
  }

  private static validate(props: QuestionProps) {
    const { type, options } = props;

    if (!props.id) throw new Error("Question must have an ID.");
    if (!props.surveyId)
      throw new Error("Question must be associated with a survey.");
    if (!props.questionText || props.questionText.trim().length === 0) {
      throw new Error("Question text cannot be empty.");
    }

    if (props.order < 0) {
      throw new Error("Question order must be a positive number.");
    }

    if (type !== options.type) {
      throw new Error(
        `Mismatch between QuestionType ('${type}') and QuestionOptions type ('${options.type}').`
      );
    }

    switch (options.type) {
      case "single-choice":
      case "multiple-choice":
        if (!options.options || options.options.length === 0) {
          throw new Error(
            `Question of type '${type}' must define at least one option.`
          );
        }
        break;
      case "rating":
        if (options.scale == null || options.scale < 1) {
          throw new Error("Rating questions must define a scale >= 1.");
        }
        break;
      case "text":
      case "number":
      case "date":
        break;
      default:
        throw new Error("Unhandled QuestionType");
    }
  }

  static create(props: QuestionProps) {
    QuestionEntity.validate(props);

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
