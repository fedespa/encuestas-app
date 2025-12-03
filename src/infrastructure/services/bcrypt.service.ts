import bcrypt from "bcrypt";
import type { HashService } from "../../application/services/hash.service.js";

export class BcryptService implements HashService {
  hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }
  compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}
