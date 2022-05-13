import { AppError } from "../../../../shared/errors/AppError";
import { IUserDTO } from "../../../dtos/IUsersDTO";
import { User } from "../../infra/typeorm/entities/Users";
import { IUserRepository } from "../../repositories/IUserRepository";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute({
    fullName,
    nickname,
    email,
    password,
  }: IUserDTO): Promise<{ user: User; token: string }> {
    const userByEmail = await this.userRepository.getByEmail(email);
    if (userByEmail) {
      throw new AppError("This email is already being used.");
    }
    const userByNickName = await this.userRepository.getByNickName(nickname);
    if (userByNickName) {
      throw new AppError("This nickname is already being used.");
    }

    const hashedPassword = await hash(password, 8);
    const user = await this.userRepository.create({
      fullName,
      nickname,
      email,
      password: hashedPassword,
    });
    const token = sign({}, "74EBC35C58A5049F0F271EBF6F78CC8F", {
      subject: user.id,
      expiresIn: "1d",
    });

    return { user, token };
  }
}

export { CreateUserUseCase };
