import { UserEntity } from "../entities/User";

export interface IAuthenticateUserResponseDTO {
  user: UserEntity;
  token: string;
}

export interface IUserResponse {
  id: string;
  nickname: string;
  email: string;
  token: string;
}
