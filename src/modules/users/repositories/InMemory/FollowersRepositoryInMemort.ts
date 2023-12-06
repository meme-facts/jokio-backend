import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { IFollowerDTO } from "@modules/users/dtos/ICreateFollowerDTO";
import { IGetRequestsDTO } from "@modules/users/dtos/IGetRequestsDTO";

import { IFollowersRepository, IRelation } from "../IFollowersRepository";
import { FollowerEntity } from "@modules/users/entities/Follower";
import {
  IGetAllFollowsDTO,
  SortByEnum,
} from "@modules/users/dtos/IGetAllFollowsInputDTO";

class FollowersRepositoryInMemory implements IFollowersRepository {
  followers: FollowerEntity[] = [];

  async getAllFollowers(
    params: IGetAllFollowsDTO
  ): Promise<{ followers: FollowerEntity[]; count: number }> {
    const followers = this.followers.filter(
      (user) => user.requestedUserId === params.userId
    );
    //sorting by createdAt desc
    if (params.sortBy === SortByEnum.createdAt) {
      followers.sort((a, b) => {
        if (a.created_at < b.created_at) {
          return 1;
        }
        if (a.created_at > b.created_at) {
          return -1;
        }
        return 0;
      });
    }
    //sorting by points desc
    const paginatedValues = followers.slice(
      (params.page - 1) * params.limit,
      params.page * params.limit
    );
    return {
      followers: paginatedValues,
      count: followers.length,
    };
  }

  async getAllFollowing({
    userId,
    sortBy,
    page,
    limit,
  }: IGetAllFollowsDTO): Promise<{
    following: FollowerEntity[];
    count: number;
  }> {
    const following = this.followers.filter(
      (user) => user.requesterUserId === userId
    );
    //sorting by createdAt desc
    if (sortBy === "createdAt") {
      following.sort((a, b) => {
        if (a.created_at < b.created_at) {
          return 1;
        }
        if (a.created_at > b.created_at) {
          return -1;
        }
        return 0;
      });
    }
    //sorting by points desc
    if (sortBy === "points") {
      following.sort((a, b) => {
        if (a.points < b.points) {
          return 1;
        }
        if (a.points > b.points) {
          return -1;
        }
        return 0;
      });
    }
    const paginatedValues = following.slice((page - 1) * limit, page * limit);
    return {
      following: paginatedValues,
      count: following.length,
    };
  }
  async getAll(): Promise<FollowerEntity[]> {
    return this.followers;
  }
  async create({
    requestedUserId,
    requesterUserId,
    fStatus,
  }: IFollowerDTO): Promise<void> {
    const relation = await this.getSolicitation(
      requestedUserId,
      requesterUserId
    );
    if (relation) {
      relation.fStatus = fStatus;
    } else {
      const followRelation = new FollowerEntity();
      Object.assign(followRelation, {
        requestedUserId,
        requesterUserId,
        fStatus,
      });
      this.followers.push(followRelation);
    }
  }
  async getSolicitation(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<FollowerEntity> {
    const relation = this.followers.find(
      (relation) =>
        relation.requestedUserId === requestedUserId &&
        relation.requesterUserId === requesterUserId
    );
    return relation;
  }
  async delete({
    requestedUserId,
    requesterUserId,
  }: IFollowerDTO): Promise<void> {
    const relationIndex = this.followers.findIndex(
      (relation) =>
        relation.requestedUserId === requestedUserId &&
        relation.requesterUserId === requesterUserId
    );
    this.followers.splice(relationIndex, 1);
  }

  async getPendingRequestsById({
    page,
    limit,
    userId,
  }: IGetRequestsDTO): Promise<{ requests: FollowerEntity[]; count: number }> {
    const followers = this.followers.filter(
      (follower) =>
        follower.fStatus === FollowerStatusEnum.Pending &&
        follower.requestedUserId === userId
    );
    const count = followers.length;
    const paginatedFollowers = followers.slice(
      (page - 1) * limit,
      page * limit
    );

    return {
      requests: paginatedFollowers,
      count,
    };
  }
  async getRelationsQuantityByUser(userId: string): Promise<IRelation> {
    const followersQuantity = this.followers.filter(
      (relation) => relation.requestedUserId === userId
    ).length;
    const followingQuantity = await this.followers.filter(
      (relation) => relation.requesterUserId === userId
    ).length;
    return {
      followersQuantity,
      followingQuantity,
    };
  }
}

export { FollowersRepositoryInMemory };
