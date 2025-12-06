import { QuestionEntity } from "../../../domain/question/question.entity.js";
import type { IQuestionRepository } from "../../../domain/question/question.repository.js";
import { QuestionModel } from "../../db/mongo/question.model.js";
import { QuestionPersistenceMapper } from "../../mappers/question.persistence.mapper.js";

export class MongoQuestionRepository implements IQuestionRepository {
  async create(question: QuestionEntity): Promise<QuestionEntity> {
    const persistence = QuestionPersistenceMapper.toPersistence(question)
    await QuestionModel.create(persistence);

    return question;
  }
}
