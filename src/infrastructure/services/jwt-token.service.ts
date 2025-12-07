import type { JwtService } from "../../application/services/jwt.service.js";
import jwt from "jsonwebtoken";

export class JwtTokenService implements JwtService {
  constructor(
    private readonly accessSecret: string,
    private readonly refreshSecret: string
  ) {}
  async generateAccessToken(payload: object): Promise<string> {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: "15m",
    });
  }
  async generateRefreshToken(payload: object): Promise<string> {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: "7d",
    });
  }
  async verifyAccessToken(token: string): Promise<any> {
    return jwt.verify(token, this.accessSecret);
  }
  async verifyRefreshToken(token: string): Promise<any> {
    return jwt.verify(token, this.refreshSecret);
  }
}
