import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  postDescription: string;

  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsUrl()
  img_url: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean = true;
}
