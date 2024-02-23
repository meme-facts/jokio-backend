import { Followers } from "@prisma/client";
import { UserEntity } from "./User";
import { randomUUID } from "crypto";

export class FollowerEntity implements Followers {
  constructor() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }
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
