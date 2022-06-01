import { IGetAllUsersDTO } from "@modules/users/dtos/IGetAllUsersDTO";
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
    isPrivate = false,
  }: IUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, {
      full_name,
      nickname,
      email,
      password,
      isPrivate,
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
  async getByNameOrNickName({
    page,
    limit,
    user_reference,
  }: IGetAllUsersDTO): Promise<{ users: User[]; count: number }> {
    let response;
    if (user_reference) {
      const users = this.users.filter(
        (user) =>
          user.full_name.includes(user_reference) ||
          user.nickname.includes(user_reference)
      );
      response = users;
    } else {
      response = this.users;
    }
    const paginatedValues = response.slice((page - 1) * limit, page * limit);
    const count = response.length;
    return {
      users: paginatedValues,
      count,
    };
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
