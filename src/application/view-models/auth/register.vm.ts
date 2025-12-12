import type { UserVm } from "../user/user.vm.js";

export interface RegisterVm {
  user: UserVm
  verificationToken: string;
}
