import { IUserDTO } from "../../dtos/ICreateUsersDTO";
import { User } from "../../infra/typeorm/entities/Users";
import { IUserRepository } from "../IUserRepository";

class UserRepositoryInMemory implements IUserRepository {
  users: User[] = [];
  async create({
    full_name,
    nickname,
    email,
    password,
  }: IUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, {
      full_name,
      nickname,
      email,
      password,
    });
    this.users.push(user);
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    return this.users.find((user) => user.email === email);
  }
  async getByNickName(nickName: string): Promise<User> {
    return this.users.find((user) => user.nickname === nickName);
  }
  async getByNicknameOrEmail(login: string): Promise<User> {
    return this.users.find(
      (user) => user.nickname === login || user.email === login
    );
  }
  async getById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }
  async update(data: User): Promise<User> {
    const user = await this.users.find((user) => user.id === data.id);
    Object.assign(user, data);
    return user;
  }
}

export { UserRepositoryInMemory };
