import type { ClientSession } from "mongoose";
import { SurveyEntity } from "../../../domain/survey/survey.entity.js";
import type { ISurveyRepository } from "../../../domain/survey/survey.repository.js";
import { SurveyModel } from "../../db/mongo/survey.model.js";
import { SurveyPersistenceMapper } from "../../mappers/survey.persistence.mapper.js";

export class MongoSurveyRepository implements ISurveyRepository {
  private session: ClientSession | null = null;

  setSession(session: ClientSession) {
    this.session = session;
  }

  clearSession() {
    this.session = null;
  }

  async create(survey: SurveyEntity): Promise<SurveyEntity> {
    const persistence = SurveyPersistenceMapper.toPersistence(survey);
    await SurveyModel.create([persistence], { session: this.session });
 
    return survey;
  }

  async findByOwnerId(ownerId: string): Promise<SurveyEntity | null> {
    const doc = await SurveyModel.findOne({ ownerId });

    if (!doc) return null;

    return SurveyPersistenceMapper.toEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await SurveyModel.deleteOne({ _id: id });
  }

  async findById(id: string): Promise<SurveyEntity | null> {
    const doc = await SurveyModel.findOne({ _id: id });

    if (!doc) return null;

    return SurveyPersistenceMapper.toEntity(doc);
  }
}
