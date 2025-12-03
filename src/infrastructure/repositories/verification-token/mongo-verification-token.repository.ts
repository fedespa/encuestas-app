import { VerificationTokenEntity } from "../../../domain/verification-token/verification-token.entity.js";
import type { IVerificationTokenRepository } from "../../../domain/verification-token/verification-token.repository.js";
import { VerificationTokenModel } from "../../db/mongo/verification-token.model.js";

export class MongoVerificationTokenRepository
  implements IVerificationTokenRepository
{
  async create(
    verificationToken: VerificationTokenEntity
  ): Promise<VerificationTokenEntity> {
    const doc = await VerificationTokenModel.create({
      _id: verificationToken.id,
      userId: verificationToken.userId,
      token: verificationToken.token,
      expiresAt: verificationToken.expiresAt,
      createdAt: verificationToken.createdAt,
    });

    return VerificationTokenEntity.create({
      id: doc._id,
      userId: doc.userId,
      token: doc.token,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
    });
  }

  async findByToken(token: string): Promise<VerificationTokenEntity | null> {
    const doc = await VerificationTokenModel.findOne({ token });

    if (!doc) return null;

    return VerificationTokenEntity.create({
      id: doc._id,
      userId: doc.userId,
      token: doc.token,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await VerificationTokenModel.deleteOne({ token });
  }
}
