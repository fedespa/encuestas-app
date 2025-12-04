import type { UserVm } from "../user/user.vm.js";

export interface LoginVm {
    user: UserVm;
    accessToken: string;
    refreshToken: string;
}