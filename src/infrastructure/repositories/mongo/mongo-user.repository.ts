import type { ClientSession } from "mongoose";
import { UserEntity } from "../../../domain/user/user.entity.js";
import type { IUserRepository } from "../../../domain/user/user.repository.js";
import { UserModel } from "../../db/mongo/user.model.js";
import { UserPersistenceMapper } from "../../mappers/user.persistence.mapper.js";

export class MongoUserRepository implements IUserRepository {
  private session: ClientSession | null = null;

  setSession(session: ClientSession) {
    this.session = session;
  }

  clearSession() {
    this.session = null;
  }

  async delete(id: string): Promise<void> {
    await UserModel.deleteOne({ _id: id });
  }

  async update(id: string, data: UserEntity): Promise<UserEntity> {
    const persistence = UserPersistenceMapper.toPersistence(data);

    const options = this.session ? { session: this.session } : {};

    await UserModel.updateOne({ _id: id }, persistence, options);
    return data;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const persistence = UserPersistenceMapper.toPersistence(user);
    await UserModel.create([persistence], { session: this.session });

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
