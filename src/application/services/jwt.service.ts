export interface JwtService {
  generateAccessToken(payload: object): Promise<string>;
  generateRefreshToken(payload: object): Promise<string>;
  verifyAccessToken(token: string): Promise<any>;
  verifyRefreshToken(token: string): Promise<any>;
}
