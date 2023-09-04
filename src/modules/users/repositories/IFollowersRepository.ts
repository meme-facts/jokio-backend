import { followers } from "@prisma/client";
import { IFollowerDTO } from "../dtos/ICreateFollowerDTO";
import { IGetRequestsDTO } from "../dtos/IGetRequestsDTO";

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
  getAll(): Promise<followers[]>;
  getSolicitation(
    requestedUserId: string,
    requesterUserId: string
  ): Promise<followers>;
  delete({ requestedUserId, requesterUserId }: IFollowerDTO): Promise<void>;
  getRelationsQuantityByUser(userId: string): Promise<IRelation>;
  getPendingRequestsById({
    page,
    limit,
    userId,
  }: IGetRequestsDTO): Promise<{ requests: followers[]; count: number }>;
}

export { IFollowersRepository };
