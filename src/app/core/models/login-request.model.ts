export type LoginRequest =
  | { username: string; password: string }
  | { email: string; password: string };