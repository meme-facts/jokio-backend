import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from "class-validator";

export class SharePostWithMultipleUsersDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  postId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  fromUserId: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID("4", { each: true })
  @ArrayNotEmpty()
  usersIds: string[];
}
