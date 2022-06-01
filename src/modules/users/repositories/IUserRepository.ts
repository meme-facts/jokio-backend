import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { IUserDTO } from "../dtos/ICreateUsersDTO";
import { IGetAllUsersDTO } from "../dtos/IGetAllUsersDTO";
import { User } from "../infra/typeorm/entities/Users";

interface IUserRepository {
  create({ full_name, nickname, email, password, id }: IUserDTO): Promise<User>;
  getByEmail(email: string): Promise<User>;
  getByNickName(nickname: string): Promise<User>;
  getByNicknameOrEmail(login: string): Promise<User>;
  getById(id: string): Promise<User>;
  getAllById(id: string): Promise<User>;
  update(user: User): Promise<User>;
  getByNameOrNickName({
    page,
    limit,
    user_reference,
  }: IGetAllUsersDTO): Promise<{ users: User[]; count: number }>;
}

export { IUserRepository };
