import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateUserDTO } from "../../infra/class-validator/user/CreateUsers.dto";
import { IUserRepository } from "../../repositories/IUserRepository";
import { UserEntity } from "@modules/users/entities/User";
import { plainToInstance } from "class-transformer";
import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute({
    full_name,
    nickname,
    email,
    password,
    isPrivate,
  }: CreateUserDTO): Promise<{ user: UserDto; token: string }> {
    const userByEmail = await this.userRepository.getByEmail(email);
    if (userByEmail) {
      throw new AppError("This email is already being used.", 409);
    }
    const userByNickName = await this.userRepository.getByNickName(nickname);
    if (userByNickName) {
      throw new AppError("This nickname is already being used.", 409);
    }

    const hashedPassword = await hash(password, 8);
    const user = await this.userRepository.create({
      full_name,
      nickname,
      email,
      password: hashedPassword,
      isPrivate,
    });
    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "1d",
    });

    return { user: plainToInstance(UserDto, user), token };
  }
}

export { CreateUserUseCase };
