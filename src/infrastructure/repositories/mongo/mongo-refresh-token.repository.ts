import type { ClientSession } from "mongoose";
import { RefreshTokenEntity } from "../../../domain/refresh-token/refresh-token.entity.js";
import type { IRefreshTokenRepository } from "../../../domain/refresh-token/refresh-token.repository.js";
import { RefreshTokenModel } from "../../db/mongo/refresh-token.model.js";
import { RefreshTokenPersistenceMapper } from "../../mappers/refresh-token.persistence.mapper.js";

export class MongoRefreshTokenRepository implements IRefreshTokenRepository {
  private session: ClientSession | null = null;

  setSession(session: ClientSession) {
    this.session = session;
  }

  clearSession() {
    this.session = null;
  }

  async create(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    const persistence =
      RefreshTokenPersistenceMapper.toPersistence(refreshToken);
    await RefreshTokenModel.create([persistence], { session: this.session });

    return refreshToken;
  }
  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    const doc = await RefreshTokenModel.findOne({ token });

    if (!doc) return null;

    return RefreshTokenPersistenceMapper.toEntity(doc);
  }
  async deleteByToken(token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
