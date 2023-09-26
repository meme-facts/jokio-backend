import { IGetAllUsersDTO } from "@modules/users/dtos/IGetAllUsersDTO";
import { Prisma, PrismaClient, users } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { IUserDTO } from "../../../dtos/ICreateUsersDTO";
import { IUserRepository } from "../../../repositories/IUserRepository";

class UserRepository implements IUserRepository {
  private repository: Prisma.usersDelegate<DefaultArgs>;
  constructor() {
    this.repository = new PrismaClient().users;
  }

  async getByNicknameOrEmail(login: string): Promise<users> {
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
  }: IGetAllUsersDTO): Promise<{ users: users[]; count: number }> {
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
  }: IUserDTO): Promise<users> {
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
  async getByEmail(email: string): Promise<users> {
    const user = await this.repository.findFirst({
      where: {
        email,
      },
    });
    return user;
  }
  async getByNickName(nickname: string): Promise<users> {
    const user = await this.repository.findFirst({
      where: {
        nickname,
      },
    });
    return user;
  }
  async getById(id: string): Promise<users> {
    const user = await this.repository.findFirst({
      where: {
        id,
      },
    });
    return user;
  }
  async getAllById(id: string): Promise<users> {
    const user = await this.repository.findFirst({
      where: {
        id,
      },
    });
    return user;
  }
  async update(user: users): Promise<users> {
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