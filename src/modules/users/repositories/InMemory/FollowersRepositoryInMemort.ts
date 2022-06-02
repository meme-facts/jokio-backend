import { IFollowerDTO } from "@modules/users/dtos/ICreateFollowerDTO";
import { IGetRequestsDTO } from "@modules/users/dtos/IGetRequestsDTO";
import { Follower } from "@modules/users/infra/typeorm/entities/Followers";
import { StatusEnum } from "@shared/enums/StatusEnum";
import { IFollowersRepository, IRelation } from "../IFollowersRepository";

class FollowersRepositoryInMemory implements IFollowersRepository {
  followers: Follower[] = [];
  async getAll(): Promise<Follower[]> {
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
      const followRelation = new Follower();
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
  ): Promise<Follower> {
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
  }: IGetRequestsDTO): Promise<{ requests: Follower[]; count: number }> {
    const followers = this.followers.filter(
      (follower) =>
        follower.fStatus === StatusEnum.Pending &&
        follower.requestedUserId === userId
    );
    const paginatedFollowers = followers.slice(
      (page - 1) * limit,
      page * limit
    );
    const count = paginatedFollowers.length;
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
