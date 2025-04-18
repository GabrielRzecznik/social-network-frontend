import { User } from "../user/user.model";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}