import { IFollowerDTO } from "../dtos/ICreateFollowerDTO";
import { IGetRequestsDTO } from "../dtos/IGetRequestsDTO";
import { Follower } from "../infra/typeorm/entities/Followers";

export interface IRelation {
  followersQuantity: number;
  followingQuantity: number;
}

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
  getRelationsQuantityByUser(userId: string): Promise<IRelation>;
  getPendingRequestsById({
    page,
    limit,
    userId,
  }: IGetRequestsDTO): Promise<{ requests: Follower[]; count: number }>;
}

export { IFollowersRepository };
