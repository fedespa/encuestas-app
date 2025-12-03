import { randomBytes } from "crypto";
import type { TokenService } from "../../application/services/token.service.js";

export class CryptoService implements TokenService {
    generateUUID(): string {
        return crypto.randomUUID();
    }

    async generate(): Promise<string> {
        return randomBytes(32).toString('hex');
    }
}