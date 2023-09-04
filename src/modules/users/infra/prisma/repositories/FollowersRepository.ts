import { StatusEnum } from "@modules/posts/enums/StatusEnum";
import { IFollowerDTO } from "@modules/users/dtos/ICreateFollowerDTO";
import { IGetRequestsDTO } from "@modules/users/dtos/IGetRequestsDTO";
import {
  IFollowersRepository,
  IRelation,
} from "@modules/users/repositories/IFollowersRepository";

import { followers, Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

class FollowersRepository implements IFollowersRepository {
  private repository: Prisma.followersDelegate<DefaultArgs>;
  constructor() {
    this.repository = new PrismaClient().followers;
  }

  async create({
    requestedUserId,
    requesterUserId,
    fStatus,
    id,
  }: IFollowerDTO): Promise<void> {
    this.repository.create({
      data: {
        requestedUserId,
        requesterUserId,
        fStatus,
        id,
      },
    });
  }
  async getAll(): Promise<followers[]> {
    return this.repository.findMany();
  }

  async getSolicitation(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<followers> {
    const relation = await this.repository.findFirst({
      where: {
        requestedUserId,
        requesterUserId,
      },
    });
    return relation;
  }
  async delete({
    requestedUserId,
    requesterUserId,
  }: IFollowerDTO): Promise<void> {
    const { id } = await this.repository.findFirst({
      where: {
        requestedUserId,
        requesterUserId,
      },
    });
    await this.repository.delete({
      where: {
        id,
      },
    });
  }
  async getPendingRequestsById({
    page,
    limit,
    userId,
  }: IGetRequestsDTO): Promise<{ requests: followers[]; count: number }> {
    const offset: number = (page - 1) * limit;

    const [count, requests] = await Promise.all([
      this.repository.count({
        where: {
          fStatus: StatusEnum.Pending,
          requestedUserId: userId,
        },
      }),
      this.repository.findMany({
        where: {
          fStatus: StatusEnum.Pending,
          requestedUserId: userId,
        },
        skip: offset,
        take: limit,
      }),
    ]);
    return {
      requests,
      count,
    };
  }
  async getRelationsQuantityByUser(userId: string): Promise<IRelation> {
    const [followersQuantity, followingQuantity] = await Promise.all([
      await this.repository.count({
        where: {
          requestedUserId: userId,
        },
      }),
      await this.repository.count({
        where: {
          requesterUserId: userId,
        },
      }),
    ]);

    return {
      followersQuantity,
      followingQuantity,
    };
  }
}

export { FollowersRepository };
