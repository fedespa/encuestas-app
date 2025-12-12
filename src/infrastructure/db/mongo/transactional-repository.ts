import type { ClientSession } from "mongoose";

export interface ITransactionalRepository {
  setSession(session: ClientSession): void;
  clearSession(): void;
}
