import { PostDislikes } from "@prisma/client";

export class PostDislikeEntity implements PostDislikes {
  id: string;
  userId: string;
  postId: string;
  created_at: Date;
  updated_at: Date;
}
