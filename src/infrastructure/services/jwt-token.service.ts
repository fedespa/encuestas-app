import type { JwtService } from "../../application/services/jwt.service.js";
import jwt, { type SignOptions } from "jsonwebtoken";
import { envConfig } from "../config/env.js";

export class JwtTokenService implements JwtService {
  constructor(
    private readonly accessSecret: string,
    private readonly refreshSecret: string
  ) {}
  async generateAccessToken(payload: object): Promise<string> {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: envConfig.accessTokenExpiresIn,
    } as SignOptions);
  }
  async generateRefreshToken(payload: object): Promise<string> {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: envConfig.refreshTokenExpiresIn,
    } as SignOptions);
  }
  async verifyAccessToken(token: string): Promise<any> {
    return jwt.verify(token, this.accessSecret);
  }
  async verifyRefreshToken(token: string): Promise<any> {
    return jwt.verify(token, this.refreshSecret);
  }
}
