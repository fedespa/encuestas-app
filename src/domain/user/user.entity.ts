export class UserEntity {
  private constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public isVerified: boolean,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    id: string;
    email: string;
    password: string;
    isVerified: boolean;
    createdAt?: Date;
  }) {
    return new UserEntity(
      props.id,
      props.email,
      props.password,
      props.isVerified,
      props.createdAt ?? new Date()
    );
  }
}
