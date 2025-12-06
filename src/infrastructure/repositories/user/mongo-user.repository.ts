import { UserEntity } from "../../../domain/user/user.entity.js";
import type { IUserRepository } from "../../../domain/user/user.repository.js";
import { UserModel } from "../../db/mongo/user.model.js";
import { UserPersistenceMapper } from "../../mappers/user.persistence.mapper.js";

export class MongoUserRepository implements IUserRepository {
  async update(id: string, data: UserEntity): Promise<UserEntity> {
    const persistence = UserPersistenceMapper.toPersistence(data);

    await UserModel.updateOne({ _id: id }, persistence);
    return data;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const persistence = UserPersistenceMapper.toPersistence(user);
    await UserModel.create(persistence);

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;

    return UserPersistenceMapper.toEntity(doc);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;

    return UserPersistenceMapper.toEntity(doc);
  }
}
