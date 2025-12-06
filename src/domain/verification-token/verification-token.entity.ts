export interface VerificationTokenProps {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}

export class VerificationTokenEntity {
  private constructor(
    private readonly id: string,
    private userId: string,
    private token: string,
    private expiresAt: Date,
    private readonly createdAt: Date = new Date()
  ) {}

  getId() {
    return this.id;
  }
  getUserId() {
    return this.userId;
  }
  getToken() {
    return this.token;
  }
  getExpiresAt() {
    return this.expiresAt;
  }
  getCreatedAt() {
    return this.createdAt;
  }

  isExpired(): boolean {
    return this.expiresAt <= new Date();
  }

  invalidate() {
    this.expiresAt = new Date();
  }

  private static validate(props: VerificationTokenProps) {
    if (!props.id) {
      throw new Error("VerificationToken must have an ID.");
    }

    if (!props.userId) {
      throw new Error("VerificationToken must have a userId.");
    }

    if (!props.token) {
      throw new Error("VerificationToken must have a token.");
    }

    if (!(props.expiresAt instanceof Date)) {
      throw new Error("expiresAt must be a Date instance.");
    }

    if (props.expiresAt <= new Date()) {
      throw new Error("expiresAt cannot be in the past.");
    }

    if (props.createdAt && !(props.createdAt instanceof Date)) {
      throw new Error("createdAt must be a Date instance.");
    }
  }

  static create(props: VerificationTokenProps) {
    VerificationTokenEntity.validate(props);

    return new VerificationTokenEntity(
      props.id,
      props.userId,
      props.token,
      props.expiresAt,
      props.createdAt ?? new Date()
    );
  }
}
