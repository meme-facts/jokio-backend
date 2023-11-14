import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { IFollowerDTO } from "@modules/users/dtos/ICreateFollowerDTO";
import { IGetRequestsDTO } from "@modules/users/dtos/IGetRequestsDTO";
import {
  IFollowersRepository,
  IRelation,
} from "@modules/users/repositories/IFollowersRepository";

import { getRepository, Repository } from "typeorm";
import { Follower } from "../entities/Followers";

class FollowersRepository implements IFollowersRepository {
  private repository: Repository<Follower>;

  constructor() {
    this.repository = getRepository(Follower);
  }

  async create({
    requestedUserId,
    requesterUserId,
    fStatus,
    id,
  }: IFollowerDTO): Promise<void> {
    const followerRelation = this.repository.create({
      requestedUserId,
      requesterUserId,
      fStatus,
      id,
    });
    await this.repository.save(followerRelation);
  }
  getAll(): Promise<Follower[]> {
    throw new Error("Method not implemented.");
  }

  async getSolicitation(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<Follower> {
    const relation = await this.repository.findOne({
      requestedUserId,
      requesterUserId,
    });
    return relation;
  }
  async delete({
    requestedUserId,
    requesterUserId,
  }: IFollowerDTO): Promise<void> {
    await this.repository.delete({
      requestedUserId,
      requesterUserId,
    });
  }
  async getPendingRequestsById({
    page,
    limit,
    userId,
  }: IGetRequestsDTO): Promise<{ requests: Follower[]; count: number }> {
    const offset: number = (page - 1) * limit;
    const count = await this.repository.count({
      where: {
        fStatus: FollowerStatusEnum.Pending,
        requestedUserId: userId,
      },
    });
    const requests = await this.repository.find({
      where: {
        fStatus: FollowerStatusEnum.Pending,
        requestedUserId: userId,
      },
      skip: offset,
      take: limit,
    });
    return {
      requests,
      count,
    };
  }
  async getRelationsQuantityByUser(userId: string): Promise<IRelation> {
    const followersQuantity = await this.repository.count({
      requestedUserId: userId,
    });
    const followingQuantity = await this.repository.count({
      requesterUserId: userId,
    });
    return {
      followersQuantity,
      followingQuantity,
    };
  }
}

export { FollowersRepository };
