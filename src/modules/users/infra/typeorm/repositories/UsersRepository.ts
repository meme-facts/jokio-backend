import { IUserDTO } from "../../../dtos/ICreateUsersDTO";
import { IUserRepository } from "../../../repositories/IUserRepository";
import { getRepository, Repository } from "typeorm";
import { User } from "../entities/Users";

class UserRepository implements IUserRepository {
  repository: Repository<User>;
  constructor() {
    this.repository = getRepository(User);
  }

  async getByNicknameOrEmail(login: string): Promise<User> {
    const user = await this.repository

      .createQueryBuilder()
      .where("email = :email OR nickname = :nickname", {
        email: login,
        nickname: login,
      })
      .getOne();
    return user;
  }

  async create({
    full_name,
    nickname,
    email,
    password,
  }: IUserDTO): Promise<User> {
    const user = this.repository.create({
      full_name,
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
  async getById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);
    return user;
  }
  async update(user: User): Promise<User> {
    const userUpdated = await this.repository.save(user);
    return userUpdated;
  }
}

export { UserRepository };
