// Типы, описывающие сырые ответы бэкенда (webdev-music API)

export interface RawTrack {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  track_file: string;
}

export interface RawSelection {
  _id: number;
  name: string;
  items: number[];
}

export interface ApiUser {
  _id: number;
  email: string;
  username: string;
}

export interface SignupResponse {
  message: string;
  result: ApiUser;
  success: boolean;
}

export interface LoginResponse {
  email: string;
  username: string;
  _id: number;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface ApiErrorBody {
  message?: string;
  detail?: string;
  code?: string;
}
