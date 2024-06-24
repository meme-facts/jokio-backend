import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { UserDto } from "./User.dto";
import { IsEnum, IsNumber } from "class-validator";

export class GetUserByIdDto extends UserDto {
  @IsNumber()
  followersQuantity: number;
  @IsNumber()
  followingQuantity: number;
  @IsEnum(FollowerStatusEnum)
  relationStatus: FollowerStatusEnum;
}
