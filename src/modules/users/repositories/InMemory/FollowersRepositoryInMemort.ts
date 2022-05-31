import { Follower } from "@modules/users/infra/typeorm/entities/Followers";
import { IFollowersRepository } from "../IFollowersRepository";

class FollowersRepositoryInMemory implements IFollowersRepository {
  followers: Follower[] = [];
  async getAll(): Promise<Follower[]> {
    return this.followers;
  }
  async create(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<void> {
    const followRelation = new Follower();
    Object.assign(followRelation, {
      requestedUserId,
      requesterUserId,
    });
    this.followers.push(followRelation);
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
    return relation
  }
}

export { FollowersRepositoryInMemory };
