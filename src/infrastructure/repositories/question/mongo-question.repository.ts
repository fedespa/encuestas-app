import { QuestionEntity } from "../../../domain/question/question.entity.js";
import type { IQuestionRepository } from "../../../domain/question/question.repository.js";
import { QuestionModel } from "../../db/mongo/question.model.js";

export class MongoQuestionRepository implements IQuestionRepository {
  async create(question: QuestionEntity): Promise<QuestionEntity> {
    const doc = await QuestionModel.create({
      _id: question.id,
      surveyId: question.surveyId,
      type: question.type,
      questionText: question.questionText,
      required: question.required,
      options: question.options,
      order: question.order,
    });

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
}
