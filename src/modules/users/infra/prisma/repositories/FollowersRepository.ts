import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { IFollowerDTO } from "@modules/users/dtos/ICreateFollowerDTO";
import {
  IGetAllFollowsDTO,
  SortByEnum,
} from "@modules/users/dtos/IGetAllFollowsInputDTO";

import { IGetRequestsDTO } from "@modules/users/dtos/IGetRequestsDTO";
import { FollowerEntity } from "@modules/users/entities/Follower";
import {
  IFollowersRepository,
  IRelation,
} from "@modules/users/repositories/IFollowersRepository";

import { Followers, Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

class FollowersRepository implements IFollowersRepository {
  private repository: Prisma.FollowersDelegate<DefaultArgs>;
  constructor() {
    this.repository = new PrismaClient().followers;
  }
  async getAllFollowers(
    params: IGetAllFollowsDTO
  ): Promise<{ followers: FollowerEntity[]; count: number }> {
    const { userId, sortBy, page, limit } = params;
    const orderBy = sortBy ? { [sortBy]: "desc" } : undefined;
    const [count, followers] = await Promise.all([
      this.repository.count({
        where: {
          requestedUserId: userId,
        },
      }),
      this.repository.findMany({
        include: {
          requester: true,
        },
        where: {
          requestedUserId: userId,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return {
      followers,
      count,
    };
  }
  async getAllFollowing(
    params: IGetAllFollowsDTO
  ): Promise<{ following: FollowerEntity[]; count: number }> {
    const { userId, sortBy, page, limit } = params;
    const orderBy = sortBy ? { [sortBy]: "desc" } : undefined;
    const [count, following] = await Promise.all([
      this.repository.count({
        where: {
          requesterUserId: userId,
        },
      }),
      this.repository.findMany({
        include: {
          requested: true,
        },
        where: {
          requesterUserId: userId,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return {
      following,
      count,
    };
  }

  async create({
    requestedUserId,
    requesterUserId,
    fStatus,
    id,
  }: IFollowerDTO): Promise<void> {
    const user = await this.repository.create({
      data: {
        requestedUserId,
        requesterUserId,
        fStatus,
        id,
      },
    });
  }
  async getAll(): Promise<Followers[]> {
    return this.repository.findMany();
  }

  async getSolicitation(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<Followers> {
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
  }: IGetRequestsDTO): Promise<{ requests: Followers[]; count: number }> {
    const offset: number = (page - 1) * limit;

    const [count, requests] = await Promise.all([
      this.repository.count({
        where: {
          fStatus: FollowerStatusEnum.Pending,
          requestedUserId: userId,
        },
      }),
      this.repository.findMany({
        where: {
          fStatus: FollowerStatusEnum.Pending,
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
