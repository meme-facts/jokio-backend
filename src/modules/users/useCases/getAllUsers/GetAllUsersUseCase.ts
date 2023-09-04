import { IGetAllUsersDTO } from "@modules/users/dtos/IGetAllUsersDTO";
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

  async execute({
    page,
    limit = 10,
    user_reference,
  }: IGetAllUsersDTO): Promise<{ users: User[]; count: number }> {
    const { users, count } = await this.usersRepository.getByNameOrNickName({
      page,
      limit,
      user_reference,
    });
    if (users.length === 0) {
      throw new AppError("User not found.");
    }
    return { users, count };
  }
}

export { GetAllUsersUseCase };
