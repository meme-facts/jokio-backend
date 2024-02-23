import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";
import { Exclude, Type } from "class-transformer";
import { IsBoolean, IsDate, IsString, IsUUID } from "class-validator";

export class CreateMessageResponseDto {
  @IsUUID()
  id: string;

  @IsUUID()
  fromUserId: string;

  @IsString()
  message: string;

  @IsUUID()
  toUserId: string;

  @IsBoolean()
  isRead: boolean;

  @IsDate()
  created_at: Date;

  @Type(() => UserDto)
  fromUser: UserDto;

  @Exclude()
  toUser: UserDto;
}
