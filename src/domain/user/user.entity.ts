export interface UserProps {
  id: string;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt?: Date;
}

export class UserEntity {
  private constructor(
    private readonly id: string,
    private email: string,
    private password: string,
    private isVerified: boolean,
    private readonly createdAt: Date
  ) {}

  getId() {
    return this.id;
  }
  getEmail() {
    return this.email;
  }
  getPassword() {
    return this.password;
  }
  getIsVerified() {
    return this.isVerified;
  }
  getCreatedAt() {
    return this.createdAt;
  }

  verifyEmail() {
    this.isVerified = true;
  }

  updatePassword(newPassword: string) {
    if (!newPassword || newPassword.length < 4) {
      throw new Error("La contraseña debe tener al menos 4 caracteres.");
    }
    this.password = newPassword;
  }

  static create(props: UserProps) {

    UserEntity.validate(props);

    return new UserEntity(
      props.id,
      props.email,
      props.password,
      props.isVerified,
      props.createdAt ?? new Date()
    );
  }

  private static validate(props: UserProps) {
    if (!props.id) {
      throw new Error("El usuario debe tener un ID.");
    }

    if (!props.email || !props.email.includes("@")) {
      throw new Error("El email no es válido.");
    }

    if (!props.password || props.password.length < 4) {
      throw new Error("La contraseña debe tener al menos 4 caracteres.");
    }

    if (typeof props.isVerified !== "boolean") {
      throw new Error("El campo isVerified debe ser booleano.");
    }
  }
}

