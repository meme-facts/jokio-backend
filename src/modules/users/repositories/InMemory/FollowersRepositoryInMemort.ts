import { ICreateFollowerDTO } from "@modules/users/dtos/ICreateFollowerDTO";
import { Follower } from "@modules/users/infra/typeorm/entities/Followers";
import { IFollowersRepository } from "../IFollowersRepository";

class FollowersRepositoryInMemory implements IFollowersRepository {
  followers: Follower[] = [];
  async getAll(): Promise<Follower[]> {
    return this.followers;
  }
  async create({
    requestedUserId,
    requesterUserId,
    fStatus,
  }: ICreateFollowerDTO): Promise<void> {
    if (fStatus) {
      const relation = await this.getSolicitation(
        requestedUserId,
        requesterUserId
      );
      relation.fStatus = fStatus;
    } else {
      const followRelation = new Follower();
      Object.assign(followRelation, {
        requestedUserId,
        requesterUserId,
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
}

export { FollowersRepositoryInMemory };
