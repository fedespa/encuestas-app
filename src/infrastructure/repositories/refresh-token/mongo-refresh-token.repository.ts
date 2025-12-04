import { RefreshTokenEntity } from "../../../domain/refresh-token/refresh-token.entity.js";
import type { IRefreshTokenRepository } from "../../../domain/refresh-token/refresh-token.repository.js";
import { RefreshTokenModel } from "../../db/mongo/refresh-token.model.js";

export class MongoRefreshTokenRepository implements IRefreshTokenRepository {
  async create(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    const doc = await RefreshTokenModel.create({
      _id: refreshToken.id,
      userId: refreshToken.userId,
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt,
      createdAt: refreshToken.createdAt,
    });

    return RefreshTokenEntity.create({
      id: doc._id,
      userId: doc.userId,
      token: doc.token,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
    });
  }
  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    const doc = await RefreshTokenModel.findOne({ token });

    if (!doc) return null;

    return RefreshTokenEntity.create({
      id: doc._id,
      userId: doc.userId,
      token: doc.token,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
    });
  }
  async deleteByToken(token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
