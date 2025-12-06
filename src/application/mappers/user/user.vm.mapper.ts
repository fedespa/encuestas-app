import type { UserEntity } from "../../../domain/user/user.entity.js";
import type { UserVm } from "../../../interfaces/http/view-models/user/user.vm.js";

export class UserMapper {
  static toVm(entity: UserEntity): UserVm {
    return {
      id: entity.getId(),
      email: entity.getEmail(),
      isVerified: entity.getIsVerified(),
      createdAt: entity.getCreatedAt().toISOString(),
    };
  }
}
