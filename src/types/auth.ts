import type { NguoiDung } from "./interfaces";

export interface LoginResponse {
  message: string;
  token: string;
  user: {
      username: string;
      hoTen: string;
      email: string;
      role: string;
  };
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: NguoiDung;
}

export interface SocialLoginResponse {
  url: string;
}

export interface LoginError {
  response: any;
  message: string;
}