import { PostLikes } from "@prisma/client";

export class PostLikeEntity implements PostLikes {
  id: string;
  userId: string;
  postId: string;
  created_at: Date;
  updated_at: Date;
}
