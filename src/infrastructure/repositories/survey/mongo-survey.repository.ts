import { SurveyEntity } from "../../../domain/survey/survey.entity.js";
import type { ISurveyRepository } from "../../../domain/survey/survey.repository.js";
import { SurveyModel } from "../../db/mongo/survey.model.js";

export class MongoSurveyRepository implements ISurveyRepository {
  async create(survey: SurveyEntity): Promise<SurveyEntity> {
    const doc = await SurveyModel.create({
      _id: survey.id,
      title: survey.title,
      description: survey.description,
      isPublic: survey.isPublic,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
      ownerId: survey.ownerId ?? null,
    });

    return SurveyEntity.create({
      id: doc._id,
      title: doc.title,
      description: doc.description,
      isPublic: doc.isPublic,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      ownerId: doc.ownerId ?? undefined,
    });
  }

  async findByOwnerId(ownerId: string): Promise<SurveyEntity | null> {
    const doc = await SurveyModel.findOne({ ownerId });

    if (!doc) return null;

    return SurveyEntity.create({
      id: doc._id,
      title: doc.title,
      description: doc.description,
      isPublic: doc.isPublic,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      ownerId: doc.ownerId!!,
    });
  }
}
