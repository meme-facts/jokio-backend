import { Followers } from "@prisma/client";

export class FollowerEntity implements Followers {
  id: string;
  fStatus: string;
  requestedUserId: string;
  requesterUserId: string;
  created_at: Date;
  updated_at: Date;
}
