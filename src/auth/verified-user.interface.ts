import { UserWithoutPassword } from "./user.schema";

export interface VerifiedUserInterface extends Request {
    user: UserWithoutPassword;
}