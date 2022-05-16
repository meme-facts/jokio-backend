import { User } from "@modules/users/infra/typeorm/entities/Users";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class GetAllUsersUseCase {
  constructor(
    @inject("UserRepository")
    private usersRepository: IUserRepository
  ) {}

  async execute(user_reference?: string): Promise<User[]> {
    const users = await this.usersRepository.getByNameOrNickName(
      user_reference
    );
    console.log(users);
    if (users.length === 0) {
      throw new AppError("User not found.");
    }
    return users;
  }
}

export { GetAllUsersUseCase };
