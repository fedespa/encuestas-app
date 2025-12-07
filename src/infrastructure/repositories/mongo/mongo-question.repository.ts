import { QuestionEntity } from "../../../domain/question/question.entity.js";
import type { IQuestionRepository } from "../../../domain/question/question.repository.js";
import { QuestionModel } from "../../db/mongo/question.model.js";
import { QuestionPersistenceMapper } from "../../mappers/question.persistence.mapper.js";

export class MongoQuestionRepository implements IQuestionRepository {
  async delete(id: string): Promise<void> {
    await QuestionModel.deleteOne({ _id: id });
  }
  async deleteMany(ids: string[]): Promise<void> {
    await QuestionModel.deleteMany({ _id: { $in: ids } });
  }
  async create(question: QuestionEntity): Promise<QuestionEntity> {
    const persistence = QuestionPersistenceMapper.toPersistence(question);
    await QuestionModel.create(persistence);

    return question;
  }

  async createMany(questions: QuestionEntity[]): Promise<QuestionEntity[]> {
    const persistenceList = questions.map((q) =>
      QuestionPersistenceMapper.toPersistence(q)
    );

    await QuestionModel.insertMany(persistenceList);

    return questions;
  }
}
