import { IUpdateUserDTO } from "@modules/users/dtos/IUpdateUsersDTO";
import { UserEntity } from "@modules/users/entities/User";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute(data: IUpdateUserDTO): Promise<Omit<UserEntity, "password">> {
    const userById = await this.userRepository.getById(data.id);
    if (!userById) {
      throw new AppError("User not found.", 404);
    }
    Object.assign(userById, data);
    const { password, ...user } = await this.userRepository.update(userById);
    return user;
  }
}

export { UpdateUserUseCase };
