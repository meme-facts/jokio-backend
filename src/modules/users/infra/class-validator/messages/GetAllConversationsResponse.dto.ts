import { IsBoolean, IsDate, IsString, IsUUID } from "class-validator";
import { UserDto } from "../user/User.dto";
import { Exclude, Type } from "class-transformer";

export class GetAllConversationsResponseDTO {
  @IsUUID()
  id: string;

  @IsString()
  message: string;

  @IsBoolean()
  isRead: boolean;

  @IsUUID()
  fromUserId: string;

  @IsUUID()
  toUserId: string;

  @Type(() => UserDto)
  chattingWith: UserDto;

  @IsDate()
  created_at: Date;

  @Exclude()
  fromUser?: UserDto;

  @Exclude()
  toUser?: UserDto;
}
