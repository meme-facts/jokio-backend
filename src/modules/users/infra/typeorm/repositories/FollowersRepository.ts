import { ICreateFollowerDTO } from "@modules/users/dtos/ICreateFollowerDTO";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
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
  }: ICreateFollowerDTO): Promise<void> {
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
}

export { FollowersRepository };
