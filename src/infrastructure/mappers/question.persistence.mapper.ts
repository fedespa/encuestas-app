import { QuestionEntity } from "../../domain/question/question.entity.js";

export class QuestionPersistenceMapper {
  static toEntity(doc: any): QuestionEntity {
    return QuestionEntity.create({
      id: doc._id,
      surveyId: doc.surveyId,
      type: doc.type,
      questionText: doc.questionText,
      required: doc.required,
      options: doc.options,
      order: doc.order,
    });
  }

  static toPersistence(entity: QuestionEntity) {
    return {
      _id: entity.getId(),
      surveyId: entity.getSurveyId(),
      type: entity.getType(),
      questionText: entity.getQuestionText(),
      required: entity.getRequired(),
      options: entity.getOptions(),
      order: entity.getOrder(),
  }
  }
}
