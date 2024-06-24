import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateUserAvatarDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  img_url: string;
}
