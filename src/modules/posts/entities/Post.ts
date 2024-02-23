import { Posts } from "@prisma/client";

export class PostEntity implements Posts {
  id: string;
  postDescription: string;
  img_url: string | null | undefined;
  isActive: boolean;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  likeCount: number;
  dislikeCount: number;
}
