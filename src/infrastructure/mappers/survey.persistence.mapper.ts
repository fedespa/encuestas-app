import { SurveyEntity } from "../../domain/survey/survey.entity.js";

export class SurveyPersistenceMapper {
  static toEntity(doc: any): SurveyEntity {
    return SurveyEntity.create({
      id: doc._id,
      title: doc.title,
      description: doc.description,
      isPublic: doc.isPublic,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      ownerId: doc.ownerId,
    });
  }

  static toPersistence(entity: SurveyEntity) {
    return {
      _id: entity.getId(),
      title: entity.getTitle(),
      description: entity.getDescription(),
      isPublic: entity.getIsPublic(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
      ownerId: entity.getOwnerId() ?? null,
    };
  }
}
