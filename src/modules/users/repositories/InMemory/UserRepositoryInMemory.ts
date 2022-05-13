import { IUserDTO } from "../../../dtos/IUsersDTO";
import { User } from "../../infra/typeorm/entities/Users";
import { IUserRepository } from "../IUserRepository";

class UserRepositoryInMemory implements IUserRepository {
  users: User[] = [];
  async create({
    fullName,
    nickname,
    email,
    password,
  }: IUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, {
      fullName,
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
}

export { UserRepositoryInMemory };
