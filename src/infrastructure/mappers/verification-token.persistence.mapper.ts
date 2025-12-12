import { VerificationTokenEntity } from "../../domain/verification-token/verification-token.entity.js";

export class VerificationTokenPersistenceMapper {
  static toEntity(doc: any): VerificationTokenEntity {
    return VerificationTokenEntity.create({
      id: doc._id,
      userId: doc.userId,
      token: doc.token,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
    });
  }

  static toPersistence(entity: VerificationTokenEntity){
    return {
        _id: entity.id,
        userId: entity.userId,
        token: entity.token,
        expiresAt: entity.expiresAt,
        createdAt: entity.createdAt
    }
  }
}
