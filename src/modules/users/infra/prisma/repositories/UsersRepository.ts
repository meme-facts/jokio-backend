import { IGetAllUsersDTO } from "@modules/users/dtos/IGetAllUsersDTO";
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
  }: IGetAllUsersDTO): Promise<{ users: Users[]; count: number }> {
    const offset: number = (page - 1) * limit;

    const [count, users] = await Promise.all([
      this.repository.count({
        where: {
          OR: [
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
          ],
        },
      }),
      this.repository.findMany({
        where: {
          OR: [
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
          ],
        },
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
    isPrivate,
  }: CreateUserDTO): Promise<Users> {
    const user = this.repository.create({
      data: {
        full_name,
        nickname,
        email,
        password,
        isPrivate,
      },
    });
    return user;
  }
  async getByEmail(email: string): Promise<Users> {
    const user = await this.repository.findFirst({
      where: {
        email,
      },
    });
    return user;
  }
  async getByNickName(nickname: string): Promise<Users> {
    const user = await this.repository.findFirst({
      where: {
        nickname,
      },
    });
    return user;
  }
  async getById(id: string): Promise<Users> {
    const user = await this.repository.findFirst({
      where: {
        id,
      },
    });
    return user;
  }
  async getAllById(id: string): Promise<Users> {
    const user = await this.repository.findFirst({
      where: {
        id,
      },
    });
    return user;
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
