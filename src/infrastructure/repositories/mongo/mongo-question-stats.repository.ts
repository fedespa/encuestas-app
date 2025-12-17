import type { ClientSession } from "mongoose";
import { QuestionStatsEntity } from "../../../domain/question-stats/question-stats.entity.js";
import type { IQuestionStatsRepository } from "../../../domain/question-stats/question-stats.repository.js";
import { QuestionStatsModel } from "../../db/mongo/question-stats.model.js";
import { QuestionStatsPersistenceMapper } from "../../mappers/question-stats.persistence.mapper.js";

export class MongoQuestionStatsRepository implements IQuestionStatsRepository {
  private session: ClientSession | null = null;

  setSession(session: ClientSession) {
    this.session = session;
  }

  clearSession() {
    this.session = null;
  }

  async createMany(
    stats: QuestionStatsEntity[]
  ): Promise<QuestionStatsEntity[]> {
    const persistenceLists = stats.map((s) =>
      QuestionStatsPersistenceMapper.toPersistence(s)
    );

    const docs = await QuestionStatsModel.insertMany(persistenceLists, {
      session: this.session,
    });

    return docs.map((doc) => QuestionStatsPersistenceMapper.toEntity(doc));
  }

  async findByQuestionIds(
    questionIds: string[]
  ): Promise<QuestionStatsEntity[]> {
    if (questionIds.length === 0) return [];

    const docs = await QuestionStatsModel.find({
      questionId: { $in: questionIds },
    });

    return docs.map((doc) => QuestionStatsPersistenceMapper.toEntity(doc));
  }

  async updateMany(stats: QuestionStatsEntity[]): Promise<void> {
    console.log(stats)

    const operations = stats.map((s) => ({
      updateOne: {
        filter: { _id: s.id },
        update: QuestionStatsPersistenceMapper.toPersistence(s),
      },
    }));

    const options = this.session ? { session: this.session } : {};

    await QuestionStatsModel.bulkWrite(operations, options);
  }
}
