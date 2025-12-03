import type { UserEntity } from "../../../../domain/user/user.entity.js";
import type { RegisterVm } from "../../view-models/auth/register.vm.js";

export class AuthMapper {
  static toRegisterVm(user: UserEntity): RegisterVm {
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token: "TOKEN TEST",
    };
  }
}
