import type { ClientSession } from "mongoose";
import { VerificationTokenEntity } from "../../../domain/verification-token/verification-token.entity.js";
import type { IVerificationTokenRepository } from "../../../domain/verification-token/verification-token.repository.js";
import { VerificationTokenModel } from "../../db/mongo/verification-token.model.js";
import { VerificationTokenPersistenceMapper } from "../../mappers/verification-token.persistence.mapper.js";

export class MongoVerificationTokenRepository
  implements IVerificationTokenRepository
{
  private session: ClientSession | null = null;

  setSession(session: ClientSession) {
    this.session = session;
  }

  clearSession() {
    this.session = null;
  }

  async create(
    verificationToken: VerificationTokenEntity
  ): Promise<VerificationTokenEntity> {
    const persistence =
      VerificationTokenPersistenceMapper.toPersistence(verificationToken);
    await VerificationTokenModel.create([persistence], { session: this.session });

    return verificationToken;
  }
  async findByToken(token: string): Promise<VerificationTokenEntity | null> {
    const doc = await VerificationTokenModel.findOne({ token });

    if (!doc) return null;

    return VerificationTokenPersistenceMapper.toEntity(doc);
  }
  async deleteByToken(token: string): Promise<void> {
    const options = this.session ? { session: this.session } : {};
    await VerificationTokenModel.deleteOne({ token }, options);
  }
  async deleteAllByUserId(userId: string): Promise<void> {
    await VerificationTokenModel.deleteMany({ userId });
  }
}
