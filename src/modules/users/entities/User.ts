import { Users } from "@prisma/client";

export class UserEntity {
  id: string;
  full_name?: string | null;
  nickname: string;
  email: string;
  password: string;
  img_url?: string | null;
  isPrivate?: boolean | null;
  created_at: Date;
  updated_at: Date;
}
