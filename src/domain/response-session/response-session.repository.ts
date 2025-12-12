import type { ResponseSessionEntity } from "./response-session.entity.js";

export interface IResponseSessionRepository {
    create(responseSession: ResponseSessionEntity): Promise<ResponseSessionEntity>;
    findById(id: string): Promise<ResponseSessionEntity | null>
    update(id: string, updatedSession: ResponseSessionEntity): Promise<ResponseSessionEntity>
}