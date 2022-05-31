import { User } from "../../infra/typeorm/entities/Users";
import { IUserRepository } from "../../repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { IUserDTO } from "../../dtos/ICreateUsersDTO";
import { AppError } from "../../../../shared/errors/AppError";
import { IUpdateUserDTO } from "@modules/users/dtos/IUpdateUsersDTO";

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute(data: IUpdateUserDTO): Promise<Omit<User, "password">> {
    const userById = await this.userRepository.getById(data.id);
    if (!userById) {
      throw new AppError("User not found.", 404);
    }
    Object.assign(userById, data);
    const user = await this.userRepository.update(userById);
    return user;
  }
}

export { UpdateUserUseCase };
