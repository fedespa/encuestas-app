import type { UserEntity } from "../../../domain/user/user.entity.js";
import type { RegisterVm } from "../../../interfaces/http/view-models/auth/register.vm.js";
import { UserMapper } from "../user/user.mapper.js";

export class AuthMapper {
  static toRegisterVm(user: UserEntity, verificationUrl: string): RegisterVm {
    return {
      user: UserMapper.toVm(user),
      verificationUrl: "",
    };
  }
}
