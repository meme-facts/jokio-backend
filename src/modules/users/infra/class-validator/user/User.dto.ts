import { UserEntity } from "@modules/users/entities/User";
import { CreateUserDTO } from "./CreateUsers.dto";
import { IsDate, IsNotEmpty, IsUUID, IsUrl } from "class-validator";
import { Exclude, Expose, Transform } from "class-transformer";
import isUrl from "is-url";

export class UserDto extends CreateUserDTO implements UserEntity {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Exclude()
  password: string;

  @Exclude()
  img_url: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsUrl()
  @Expose()
  @Transform(({ obj }) => {
    if (!obj.img_url) {
      return null;
    }
    if (isUrl(obj.img_url)) {
      return obj.img_url;
    }
    switch (process.env.NODE_ENV) {
      case "test":
        return `${process.env.APP_API_URL}/avatar/${obj.img_url}`;
      case "prod":
        return `${process.env.AWS_BUCKET_URL}/avatar/${obj.img_url}`;
      default:
        return null;
    }
  })
  img_full_url: string;
}
