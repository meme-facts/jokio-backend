import { IFollowerDTO } from "../dtos/ICreateFollowerDTO";
import { IGetRequestsDTO } from "../dtos/IGetRequestsDTO";
import { FollowerEntity } from "../entities/Follower";

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
  getAll(): Promise<FollowerEntity[]>;
  getSolicitation(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<FollowerEntity>;
  delete({ requestedUserId, requesterUserId }: IFollowerDTO): Promise<void>;
  getRelationsQuantityByUser(userId: string): Promise<IRelation>;
  getPendingRequestsById({
    page,
    limit,
    userId,
  }: IGetRequestsDTO): Promise<{ requests: FollowerEntity[]; count: number }>;
}

export { IFollowersRepository };
