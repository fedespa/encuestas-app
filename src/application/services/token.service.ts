export interface TokenService {
  generate(): Promise<string>;
  generateUUID(): string;
}
