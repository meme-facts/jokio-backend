import { IUserDTO } from "../../../dtos/ICreateUsersDTO";
import { IUserRepository } from "../../../repositories/IUserRepository";
import { getRepository, Repository } from "typeorm";
import { User } from "../entities/Users";
import { IGetAllUsersDTO } from "@modules/users/dtos/IGetAllUsersDTO";

class UserRepository implements IUserRepository {
  private repository: Repository<User>;
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

  async getByNameOrNickName({
    page,
    limit = 10,
    user_reference,
  }: IGetAllUsersDTO): Promise<{ users: User[]; count: number }> {
    const offset: number = (page - 1) * limit;
    const count = await this.repository
      .createQueryBuilder()
      .where("full_name ILIKE :full_name OR nickname ILIKE :nickname", {
        full_name: `%${user_reference ?? ""}%`,
        nickname: `%${user_reference ?? ""}%`,
      })
      .getCount();
    const users = await this.repository
      .createQueryBuilder()
      .where("full_name ILIKE :full_name OR nickname ILIKE :nickname", {
        full_name: `%${user_reference ?? ""}%`,
        nickname: `%${user_reference ?? ""}%`,
      })
      .orderBy("full_name", "ASC")
      .skip(offset)
      .take(limit)
      .getMany();
    return {
      users,
      count,
    };
  }

  async create({
    full_name,
    nickname,
    email,
    password,
    isPrivate,
  }: IUserDTO): Promise<User> {
    const user = this.repository.create({
      full_name,
      nickname,
      email,
      password,
      isPrivate,
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
    const user = await this.repository.findOne({
      where: {
        id,
      },
      relations: ["following", "followers"],
    });
    return user;
  }
  async getAllById(id: string): Promise<User> {
    const user = await this.repository.findOne(id, {
      relations: ["following", "followers"],
    });
    return user;
  }
  async update(user: User): Promise<User> {
    const userUpdated = await this.repository.save(user);
    return userUpdated;
  }
}

export { UserRepository };
