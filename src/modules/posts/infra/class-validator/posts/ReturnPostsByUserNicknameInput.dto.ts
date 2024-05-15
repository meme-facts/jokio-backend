import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ReturnPostsByUserNicknameInputDTO {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  logged_user_id: string;
}
