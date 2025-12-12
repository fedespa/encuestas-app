import { UserEntity } from "../../domain/user/user.entity.js";

export class UserPersistenceMapper {
  static toEntity(doc: any): UserEntity {
    return UserEntity.create({
      id: doc._id,
      email: doc.email,
      password: doc.password,
      isVerified: doc.isVerified,
      createdAt: doc.createdAt,
    });
  }

  static toPersistence(entity: UserEntity) {
    return {
      _id: entity.id,
      email: entity.email,
      password: entity.password,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt,
    };
  }
}
