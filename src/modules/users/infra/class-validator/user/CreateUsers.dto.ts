import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";

export class CreateUserDTO {
  @IsString()
  @IsOptional()
  @MinLength(3)
  full_name?: string | null;

  @IsUrl()
  @IsOptional()
  img_url?: string | null;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nickname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean | null;
}
