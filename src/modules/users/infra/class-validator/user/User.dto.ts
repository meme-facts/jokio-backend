import { UserEntity } from "@modules/users/entities/User";
import { CreateUserDTO } from "./CreateUsers.dto";
import { IsDate, IsNotEmpty, IsUUID } from "class-validator";
import { Exclude } from "class-transformer";

export class UserDto extends CreateUserDTO implements UserEntity {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Exclude()
  password: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}
