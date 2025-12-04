import type { RefreshTokenEntity } from "./refresh-token.entity.js";

export interface IRefreshTokenRepository {

    create(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity>
    findByToken(token: string): Promise<RefreshTokenEntity | null>;
    deleteByToken(token: string): Promise<void>;

}