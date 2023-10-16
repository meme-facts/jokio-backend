import { IUserDTO } from "../dtos/ICreateUsersDTO";
import { IGetAllUsersDTO } from "../dtos/IGetAllUsersDTO";
import { UserEntity } from "../entities/User";

interface IUserRepository {
  create({
    full_name,
    nickname,
    email,
    password,
    id,
  }: IUserDTO): Promise<UserEntity>;
  getByEmail(email: string): Promise<UserEntity>;
  getByNickName(nickname: string): Promise<UserEntity>;
  getByNicknameOrEmail(login: string): Promise<UserEntity>;
  getById(id: string): Promise<UserEntity>;
  getAllById(id: string): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  getByNameOrNickName({
    page,
    limit,
    user_reference,
  }: IGetAllUsersDTO): Promise<{ users: UserEntity[]; count: number }>;
}

export { IUserRepository };
