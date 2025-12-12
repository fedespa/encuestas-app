import type { ClientSession } from "mongoose";
import { ResponseSessionEntity } from "../../../domain/response-session/response-session.entity.js";
import type { IResponseSessionRepository } from "../../../domain/response-session/response-session.repository.js";
import { ResponseSessionModel } from "../../db/mongo/response-session.model.js";

export class MongoResponseSessionRepository
  implements IResponseSessionRepository
{
  private session: ClientSession | null = null;

  setSession(session: ClientSession) {
    this.session = session;
  }

  clearSession() {
    this.session = null;
  }

  async create(
    responseSession: ResponseSessionEntity
  ): Promise<ResponseSessionEntity> {
    const persistence = {
      _id: responseSession.id,
      surveyId: responseSession.surveyId,
      userId: responseSession.userId,
      startedAt: responseSession.startedAt,
      finishedAt: responseSession.finishedAt ?? null,
      abandonedAtQuestionId: responseSession.abandonedAtQuestionId ?? null,
    };

    await ResponseSessionModel.create([persistence], { session: this.session });

    return responseSession;
  }

  async findById(id: string): Promise<ResponseSessionEntity | null> {
    const doc = await ResponseSessionModel.findOne({ _id: id });

    if (!doc) return null;

    return ResponseSessionEntity.create({
      id,
      surveyId: doc.surveyId,
      userId: doc.userId ?? null,
      startedAt: doc.startedAt,
      finishedAt: doc.finishedAt ?? undefined,
      abandonedAtQuestionId: doc.abandonedAtQuestionId ?? undefined,
    });
  }

  async update(
    id: string,
    updatedSession: ResponseSessionEntity
  ): Promise<ResponseSessionEntity> {
    const persistence = {
      _id: updatedSession.id,
      surveyId: updatedSession.surveyId,
      userId: updatedSession.userId,
      startedAt: updatedSession.startedAt,
      finishedAt: updatedSession.finishedAt ?? null,
      abandonedAtQuestionId: updatedSession.abandonedAtQuestionId ?? null,
    };

    const options = this.session ? { session: this.session } : {};

    await ResponseSessionModel.updateOne({ _id: id }, persistence, options);

    return updatedSession;
  }
}
