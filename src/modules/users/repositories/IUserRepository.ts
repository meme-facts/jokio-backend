import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IGetAllUsersDTO } from "../dtos/IGetAllUsersDTO";
import { UserEntity } from "../entities/User";

interface IUserRepository {
  create({
    full_name,
    nickname,
    email,
    password,
    img_url,
    isPrivate,
  }: ICreateUserDTO): Promise<UserEntity>;
  getManyByIds(ids: string[]): Promise<UserEntity[]>;
  getByEmail(email: string): Promise<UserEntity>;
  getByNickName(nickname: string): Promise<UserEntity>;
  getByNicknameOrEmail(login: string): Promise<UserEntity>;
  getById(id: string): Promise<UserEntity>;
  getAllById(id: string): Promise<UserEntity>;
  update(user: Partial<UserEntity>): Promise<UserEntity>;
  getByNameOrNickName({
    page,
    limit,
    user_reference,
  }: IGetAllUsersDTO): Promise<{ users: UserEntity[]; count: number }>;
}

export { IUserRepository };
