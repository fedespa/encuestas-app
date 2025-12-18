import { User } from "../domain/user/user.entity.ts"

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
