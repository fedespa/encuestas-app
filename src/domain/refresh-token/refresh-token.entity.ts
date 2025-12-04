export class RefreshTokenEntity {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(props: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt?: Date;
  }) {
    return new RefreshTokenEntity(
      props.id,
      props.userId,
      props.token,
      props.expiresAt,
      props.createdAt ?? new Date()
    );
  }
}
