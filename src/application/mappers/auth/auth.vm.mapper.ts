import type { UserEntity } from "../../../domain/user/user.entity.js";
import type { RegisterVm } from "../../view-models/auth/register.vm.js";
import { UserMapper } from "../user/user.vm.mapper.js";

export class AuthVMMapper {
  static toRegisterVm(user: UserEntity, verificationUrl: string): RegisterVm {
    return {
      user: UserMapper.toVm(user),
      verificationUrl: "",
    };
  }
}
