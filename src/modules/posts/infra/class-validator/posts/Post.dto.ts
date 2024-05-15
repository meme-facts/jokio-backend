import { IsBoolean, IsDate, IsNotEmpty, IsUUID } from "class-validator";
import { CreatePostDto } from "./CreatePost.dto";

export class PostDto extends CreatePostDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsDate()
  @IsNotEmpty()
  created_at: Date;

  @IsDate()
  @IsNotEmpty()
  updated_at: Date;
}
