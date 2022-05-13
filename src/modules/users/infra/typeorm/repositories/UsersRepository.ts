import { IUserDTO } from "modules/dtos/IUsersDTO";
import { IUserRepository } from "modules/users/repositories/IUserRepository";
import { getRepository, Repository } from "typeorm";
import { User } from "../entities/Users";

class UserRepository implements IUserRepository {
  repository: Repository<User>;
  constructor() {
    this.repository = getRepository(User);
  }
  getByNicknameOrEmail(login: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  async create({
    fullName,
    nickname,
    email,
    password,
  }: IUserDTO): Promise<User> {
    const user = this.repository.create({
      full_name: fullName,
      nickname,
      email,
      password,
    });
    await this.repository.save(user);
    return user;
  }
  async getByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });
    return user;
  }
  async getByNickName(nickname: string): Promise<User> {
    const user = await this.repository.findOne({ nickname });
    return user;
  }
}

export { UserRepository };
