import type { ClientSession } from "mongoose";
import { QuestionEntity } from "../../../domain/question/question.entity.js";
import type { IQuestionRepository } from "../../../domain/question/question.repository.js";
import { QuestionModel } from "../../db/mongo/question.model.js";
import { QuestionPersistenceMapper } from "../../mappers/question.persistence.mapper.js";

export class MongoQuestionRepository implements IQuestionRepository {
  private session: ClientSession | null = null;

  setSession(session: ClientSession) {
    this.session = session;
  }

  clearSession() {
    this.session = null;
  }

  async delete(id: string): Promise<void> {
    await QuestionModel.deleteOne({ _id: id });
  }
  async deleteMany(ids: string[]): Promise<void> {
    await QuestionModel.deleteMany({ _id: { $in: ids } });
  }

  async findBySurveyId(surveyId: string): Promise<QuestionEntity[]> {
    const docs = await QuestionModel.find({ surveyId }).lean();

    return docs.map((doc) => QuestionPersistenceMapper.toEntity(doc));
  }

  async create(question: QuestionEntity): Promise<QuestionEntity> {
    const persistence = QuestionPersistenceMapper.toPersistence(question);
    await QuestionModel.create([persistence], { session: this.session });

    return question;
  }

  async createMany(questions: QuestionEntity[]): Promise<QuestionEntity[]> {
    const persistenceList = questions.map((q) =>
      QuestionPersistenceMapper.toPersistence(q)
    );

    await QuestionModel.insertMany(persistenceList, { session: this.session });

    return questions;
  }
}
