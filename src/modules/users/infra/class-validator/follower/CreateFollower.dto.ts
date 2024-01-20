import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFollowerDTO {
  @IsString()
  @IsNotEmpty()
  requestedUserId: string;

  @IsString()
  @IsNotEmpty()
  requesterUserId: string;

  @IsOptional()
  @IsString()
  fStatus?: string;
}
