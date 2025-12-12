import { RefreshTokenEntity } from "../../domain/refresh-token/refresh-token.entity.js";

export class RefreshTokenPersistenceMapper {
  static toEntity(doc: any): RefreshTokenEntity {
    return RefreshTokenEntity.create({
      id: doc._id,
      userId: doc.userId,
      token: doc.token,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
    });
  }

  static toPersistence(entity: RefreshTokenEntity) {
    return {
      _id: entity.id,
      userId: entity.userId,
      token: entity.token,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt
    };
  }
}
