import { Comments } from "@prisma/client";

export class CommentEntity implements Comments {
  id: string;
  message: string;
  userId: string;
  postId: string;
  created_at: Date;
  updated_at: Date;
}
