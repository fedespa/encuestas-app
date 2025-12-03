import { UserEntity } from "../../../domain/user/user.entity.js";
import type { IUserRepository } from "../../../domain/user/user.repository.js";
import { UserModel } from "../../db/mongo/user.model.js";

export class MongoUserRepository implements IUserRepository {
  async create(user: UserEntity): Promise<UserEntity> {
    const doc = await UserModel.create({
      _id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    });

    return UserEntity.create({
      id: doc._id,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;

    return UserEntity.create({
      id: doc._id,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;

    return UserEntity.create({
      id: doc._id,
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
    });
  }
}
