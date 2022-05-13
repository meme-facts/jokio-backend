import { IUserDTO } from "../../dtos/IUsersDTO";
import { User } from "../infra/typeorm/entities/Users";

interface IUserRepository {
  create({ fullName, nickname, email, password }: IUserDTO): Promise<User>;
  getByEmail(email: string): Promise<User>;
  getByNickName(nickname: string): Promise<User>;
  getByNicknameOrEmail(login: string): Promise<User>;
}

export { IUserRepository };
