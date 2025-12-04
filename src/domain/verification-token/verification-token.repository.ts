import type { VerificationTokenEntity } from "./verification-token.entity.js";

export interface IVerificationTokenRepository {

    create(verificationToken: VerificationTokenEntity): Promise<VerificationTokenEntity>;
    findByToken(token: string): Promise<VerificationTokenEntity | null>;
    deleteByToken(token: string): Promise<void>;
    deleteAllByUserId(userId: string): Promise<void>;


}