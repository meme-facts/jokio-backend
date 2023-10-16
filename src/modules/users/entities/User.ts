import { Users } from "@prisma/client";

export class UserEntity implements Users {
  id: string;
  full_name: string | null | undefined;
  nickname: string;
  email: string;
  password: string;
  img_url: string | null | undefined;
  isPrivate: boolean;
  created_at: Date;
  updated_at: Date;
}
