import { ICreateFollowerDTO } from "../dtos/ICreateFollowerDTO";
import { Follower } from "../infra/typeorm/entities/Followers";

interface IFollowersRepository {
  create({
    requestedUserId,
    requesterUserId,
    fStatus,
  }: ICreateFollowerDTO): Promise<void>;
  getAll(): Promise<Follower[]>;
  getSolicitation(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<Follower>;
}

export { IFollowersRepository };
