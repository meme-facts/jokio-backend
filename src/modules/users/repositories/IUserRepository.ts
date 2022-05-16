import { IUserDTO } from "../dtos/ICreateUsersDTO";
import { User } from "../infra/typeorm/entities/Users";

interface IUserRepository {
  create({ full_name, nickname, email, password, id }: IUserDTO): Promise<User>;
  getByEmail(email: string): Promise<User>;
  getByNickName(nickname: string): Promise<User>;
  getByNicknameOrEmail(login: string): Promise<User>;
  getById(id: string): Promise<User>;
  update(user: User): Promise<User>;
  getByNameOrNickName(user_reference?: string): Promise<User[]>;
}

export { IUserRepository };
