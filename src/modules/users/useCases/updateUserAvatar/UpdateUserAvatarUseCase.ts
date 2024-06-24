import { UpdateUserAvatarDto } from "@modules/users/infra/class-validator/user/UpdateUserAvatar.dto";
import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { ESharedInstances } from "@shared/container/shared/shared.enum";
import { EUserRepositories } from "@shared/container/users/user.enum";
import { AppError } from "@shared/errors/AppError";
import { validateAndTransformData } from "@shared/infra/http/middlewares/helpers/validators/TransformAndValidate";
import { IStorageProvider } from "@shared/providers/IStorageProvider";
import { plainToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

interface IUpdateUserAvatarInput {
  user_id: string;
  avatar_file: string;
}

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject(EUserRepositories.UserRepository)
    private userRepository: IUserRepository,
    @inject(ESharedInstances.StorageProvider)
    private storageProvider: IStorageProvider
  ) {}

  async execute({
    user_id,
    avatar_file,
  }: IUpdateUserAvatarInput): Promise<UserDto> {
    const user = await this.userRepository.getById(user_id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (user.img_url) {
      await this.storageProvider.delete(user.img_url, "avatar");
    }
    await this.storageProvider.save(avatar_file, "avatar");

    const parsed = await validateAndTransformData(UpdateUserAvatarDto, {
      id: user_id,
      img_url: avatar_file,
    });

    const updatedUser = await this.userRepository.update(parsed);

    return plainToInstance(UserDto, updatedUser);
  }
}
