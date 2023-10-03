import { users } from "@prisma/client";
import { IUserDTO } from "../dtos/ICreateUsersDTO";
import { IGetAllUsersDTO } from "../dtos/IGetAllUsersDTO";

interface IUserRepository {
  create({
    full_name,
    nickname,
    email,
    password,
    id,
  }: IUserDTO): Promise<users>;
  getByEmail(email: string): Promise<users>;
  getByNickName(nickname: string): Promise<users>;
  getByNicknameOrEmail(login: string): Promise<users>;
  getById(id: string): Promise<users>;
  getAllById(id: string): Promise<users>;
  update(user: users): Promise<users>;
  getByNameOrNickName({
    page,
    limit,
    user_reference,
  }: IGetAllUsersDTO): Promise<{ users: users[]; count: number }>;
}

export { IUserRepository };
