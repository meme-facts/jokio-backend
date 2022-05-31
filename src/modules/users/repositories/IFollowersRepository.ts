import { IFollowerDTO } from "../dtos/ICreateFollowerDTO";
import { Follower } from "../infra/typeorm/entities/Followers";

interface IFollowersRepository {
  create({
    requestedUserId,
    requesterUserId,
    fStatus,
    id,
  }: IFollowerDTO): Promise<void>;
  getAll(): Promise<Follower[]>;
  getSolicitation(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<Follower>;
  delete({ requestedUserId, requesterUserId }: IFollowerDTO): Promise<void>;
}

export { IFollowersRepository };
