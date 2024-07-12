import {
  IGetAllFollowingDTO,
  IGetAllUsersDTO,
} from "@modules/users/dtos/IGetAllUsersDTO";
import { CreateUserDTO } from "../../infra/class-validator/user/CreateUsers.dto";
import { IUserRepository } from "../IUserRepository";
import { UserEntity } from "@modules/users/entities/User";
import { v4 as uuidV4 } from "uuid";
import { PostEntity } from "@modules/posts/entities/Post";
import { IFollowersRepository } from "../IFollowersRepository";

class UserRepositoryInMemory implements IUserRepository {
  constructor(private readonly followersRepository?: IFollowersRepository) {}
  post: PostEntity[] = [];
  users: UserEntity[] = [];
  async getManyByIds(ids: string[]): Promise<UserEntity[]> {
    return this.users.filter((user) => ids.includes(user.id));
  }
  async create({
    full_name,
    nickname,
    email,
    password,
    img_url,
    isPrivate = false,
  }: CreateUserDTO): Promise<UserEntity> {
    const user = new UserEntity();
    Object.assign(user, {
      id: uuidV4(),
      full_name,
      nickname,
      email,
      password,
      isPrivate,
      img_url,
    });
    this.users.push(user);
    return user;
  }

  async getByEmail(email: string): Promise<UserEntity> {
    return this.users.find((user) => user.email === email);
  }
  async getByNickName(nickName: string): Promise<UserEntity> {
    return this.users.find((user) => user.nickname === nickName);
  }
  async getByNicknameOrEmail(login: string): Promise<UserEntity> {
    return this.users.find(
      (user) => user.nickname === login || user.email === login
    );
  }
  async getByNameOrNickName({
    page,
    limit,
    user_reference,
    logged_user_id,
  }: IGetAllUsersDTO): Promise<{ users: UserEntity[]; count: number }> {
    let response;
    if (user_reference) {
      const users = this.users.filter(
        (user) =>
          (user.full_name.includes(user_reference) ||
            user.nickname.includes(user_reference)) &&
          user.id !== logged_user_id
      );
      response = users;
    } else {
      response = this.users.filter((user) => user.id !== logged_user_id);
    }
    const paginatedValues = response.slice((page - 1) * limit, page * limit);
    const count = response.length;
    return {
      users: paginatedValues,
      count,
    };
  }
  async getFollowingByNameOrNickName({
    page,
    limit,
    user_reference,
    following_id,
  }: IGetAllFollowingDTO): Promise<{ users: UserEntity[]; count: number }> {
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

    if (this.followersRepository) {
      const followers = await this.followersRepository.getAllFollowing({
        page: 1,
        userId: following_id,
        limit: 1000,
      });

      response = response.filter((user) =>
        followers.following.some(
          (followers) => followers.requestedUserId === user.id
        )
      );
    }
    const paginatedValues = response.slice((page - 1) * limit, page * limit);
    const count = response.length;
    return {
      users: paginatedValues,
      count,
    };
  }

  async getById(id: string): Promise<UserEntity> {
    const user = this.users.find((user) => user.id === id);
    return user;
  }
  async update(data: UserEntity): Promise<UserEntity> {
    const user = await this.users.find((user) => user.id === data.id);
    Object.assign(user, data);
    return user;
  }
  async getAllById(id: string): Promise<UserEntity[]> {
    return this.users.filter((user) => user.id !== id);
  }
}

export { UserRepositoryInMemory };
