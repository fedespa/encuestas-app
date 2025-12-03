import crypto from "crypto";

export class UserEntity {
  private constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date;
  }) {
    return new UserEntity(
      props.id ?? crypto.randomUUID(),
      props.email,
      props.password,
      props.createdAt ?? new Date()
    );
  }
}
