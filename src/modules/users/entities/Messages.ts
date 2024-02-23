import { Messages } from "@prisma/client";
import { UserEntity } from "./User";
import { randomUUID } from "crypto";

class MessagesEntity implements Messages {
  constructor() {
    if (!this.id) {
      this.id = randomUUID();
    }
    if (!this.created_at) {
      this.created_at = new Date();
    }
  }
  id: string;
  message: string;
  isRead: boolean;
  fromUserId: string;
  fromUser?: UserEntity;
  toUserId: string;
  toUser?: UserEntity;
  created_at: Date;
}
export { MessagesEntity };
