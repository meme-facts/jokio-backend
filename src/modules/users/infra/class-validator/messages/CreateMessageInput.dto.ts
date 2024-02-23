import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateMessageInputDTO {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUUID()
  @IsNotEmpty()
  fromUserId: string;

  @IsUUID()
  @IsNotEmpty()
  toUserId: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
