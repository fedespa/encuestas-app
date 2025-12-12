import type { ClientSession } from "mongoose";
import { AnswerEntity } from "../../../domain/answer/answer.entity.js";
import type { IAnswerRepository } from "../../../domain/answer/answer.repository.js";
import { AnswerModel } from "../../db/mongo/answer.model.js";

export class MongoAnswerRepository implements IAnswerRepository {
  private session: ClientSession | null = null;

  setSession(session: ClientSession) {
    this.session = session;
  }

  clearSession() {
    this.session = null;
  }

  async create(answer: AnswerEntity): Promise<AnswerEntity> {
    await AnswerModel.create(
      [
        {
          _id: answer.id,
          sessionId: answer.sessionId,
          questionId: answer.questionId,
          value: answer.value,
        },
      ],
      { session: this.session }
    );

    return answer;
  }
  async createMany(answers: AnswerEntity[]): Promise<AnswerEntity[]> {
    const persistenceList = answers.map((a) => ({
      _id: a.id,
      sessionId: a.sessionId,
      questionId: a.questionId,
      value: a.value,
    }));

    await AnswerModel.insertMany(persistenceList, { session: this.session });

    return answers;
  }
}
