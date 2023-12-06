import { Followers } from "@prisma/client";
import { UserEntity } from "./User";

export class FollowerEntity implements Followers {
  id: string;
  fStatus: string;
  requestedUserId: string;
  requested?: UserEntity;
  requesterUserId: string;
  requester?: UserEntity;
  created_at: Date;
  updated_at: Date;
  points: number;
}
