import {
  IGetAllFollowingDTO,
  IGetAllUsersDTO,
} from "@modules/users/dtos/IGetAllUsersDTO";
import { Prisma, PrismaClient, Users } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { CreateUserDTO } from "../../class-validator/user/CreateUsers.dto";
import { IUserRepository } from "../../../repositories/IUserRepository";
import { UserEntity } from "@modules/users/entities/User";
import { prisma } from "@shared/container";

class UserRepository implements IUserRepository {
  private repository: Prisma.UsersDelegate<DefaultArgs>;
  constructor() {
    this.repository = prisma.users;
  }

  getManyByIds(ids: string[]): Promise<UserEntity[]> {
    return this.repository.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async getByNicknameOrEmail(login: string): Promise<Users> {
    if (!login) {
      return null;
    }
    const user = await this.repository.findFirst({
      where: {
        OR: [
          {
            nickname: login,
          },
          {
            email: login,
          },
        ],
      },
    });

    return user;
  }

  async getByNameOrNickName({
    page,
    limit = 10,
    user_reference,
    logged_user_id,
  }: IGetAllUsersDTO): Promise<{ users: Users[]; count: number }> {
    const offset: number = (page - 1) * limit;
    const whereClause: Prisma.UsersWhereInput = {
      NOT: {
        id: logged_user_id,
      },
    };
    if (user_reference) {
      whereClause.OR = [
        {
          full_name: {
            contains: user_reference,
            mode: "insensitive",
          },
        },
        {
          nickname: {
            contains: user_reference,
            mode: "insensitive",
          },
        },
      ];
    }

    const [count, users] = await Promise.all([
      this.repository.count({
        where: whereClause,
      }),
      this.repository.findMany({
        where: whereClause,
        orderBy: {
          full_name: "asc",
        },
        take: limit,
        skip: offset,
      }),
    ]);
    return {
      count,
      users,
    };
  }
  async getFollowingByNameOrNickName({
    page,
    limit,
    user_reference,
    following_id,
  }: IGetAllFollowingDTO): Promise<{ users: UserEntity[]; count: number }> {
    const offset: number = (page - 1) * limit;

    const whereClause: Prisma.UsersWhereInput = {
      requesteds: {
        some: {
          requesterUserId: following_id,
        },
      },
    };
    if (user_reference) {
      whereClause.OR = [
        {
          full_name: {
            contains: user_reference,
            mode: "insensitive",
          },
        },
        {
          nickname: {
            contains: user_reference,
            mode: "insensitive",
          },
        },
      ];
    }

    const [count, users] = await Promise.all([
      this.repository.count({
        where: whereClause,
      }),
      this.repository.findMany({
        where: whereClause,
        orderBy: {
          full_name: "asc",
        },
        take: limit,
        skip: offset,
      }),
    ]);
    return {
      count,
      users,
    };
  }

  async create({
    full_name,
    nickname,
    email,
    password,
    img_url,
    isPrivate,
  }: CreateUserDTO): Promise<Users> {
    const user = this.repository.create({
      data: {
        full_name,
        nickname,
        email,
        password,
        img_url,
        isPrivate,
      },
    });
    return user;
  }
  async getByEmail(email: string): Promise<Users> {
    const user = await this.repository.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  async getByNickName(nickname: string): Promise<Users> {
    const user = await this.repository.findUnique({
      where: {
        nickname,
      },
    });
    return user;
  }
  async getById(id: string): Promise<Users> {
    const user = await this.repository.findUnique({
      where: {
        id,
      },
    });
    return user;
  }
  async getAllById(id: string): Promise<Users[]> {
    const users = await this.repository.findMany({
      where: {
        NOT: {
          id,
        },
      },
    });
    return users;
  }
  async update(user: Users): Promise<Users> {
    const { id, ...rest } = user;
    const userUpdated = await this.repository.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
    return userUpdated;
  }
}

export { UserRepository };
