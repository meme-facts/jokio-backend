import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class GetConversationInputDTO {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  loggedUserId: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  targetUserId: string;

  @IsNumber()
  @IsNotEmpty()
  offset: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;
}
