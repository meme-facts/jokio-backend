import { IFollowerDTO } from "../dtos/ICreateFollowerDTO";
import { IGetAllFollowsDTO } from "../dtos/IGetAllFollowsInputDTO";
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
  }: IFollowerDTO): Promise<void>;
  getAll(): Promise<FollowerEntity[]>;
  getAllFollowing(
    params: IGetAllFollowsDTO
  ): Promise<{ following: FollowerEntity[]; count: number }>;
  getAllFollowers(
    params: IGetAllFollowsDTO
  ): Promise<{ followers: FollowerEntity[]; count: number }>;
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
