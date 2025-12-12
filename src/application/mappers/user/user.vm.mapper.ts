import type { UserEntity } from "../../../domain/user/user.entity.js";
import type { UserVm } from "../../view-models/user/user.vm.js";

export class UserMapper {
  static toVm(entity: UserEntity): UserVm {
    return {
      id: entity.id,
      email: entity.email,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
