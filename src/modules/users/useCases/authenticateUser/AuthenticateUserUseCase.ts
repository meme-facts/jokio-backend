import { IUserRepository } from "../../repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { User } from "../../../users/infra/typeorm/entities/Users";
import { AppError } from "../../../../shared/errors/AppError";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface ILoginDTO {
  login: string;
  password: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  async execute({
    login,
    password,
  }: ILoginDTO): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.getByNicknameOrEmail(login);
    if (!user) {
      throw new AppError("Login or password incorrect.");
    }
    const passwordHasMatch = await compare(password, user.password);
    if (!passwordHasMatch) {
      throw new AppError("Login or password incorrect.");
    }

    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "1d",
    });
    return {
      token,
      user,
    };
  }
}

export { AuthenticateUserUseCase };
