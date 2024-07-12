import { IGetAllFollowingDTO } from "@modules/users/dtos/IGetAllUsersDTO";
import { UserEntity } from "@modules/users/entities/User";
import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { EUserRepositories } from "@shared/container/users/user.enum";
import { AppError } from "@shared/errors/AppError";
import { plainToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";

@injectable()
class GetAllFollowingUseCase {
  constructor(
    @inject(EUserRepositories.UserRepository)
    private usersRepository: IUserRepository
  ) {}

  async execute({
    page,
    limit = 10,
    user_reference,
    following_id,
  }: IGetAllFollowingDTO): Promise<{ users: UserEntity[]; count: number }> {
    const { users, count } =
      await this.usersRepository.getFollowingByNameOrNickName({
        page,
        limit,
        user_reference,
        following_id,
      });
    const parsed = plainToInstance(UserDto, users);
    return { users: parsed, count };
  }
}

export { GetAllFollowingUseCase };
