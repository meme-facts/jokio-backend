import { IUserRepository } from "modules/users/repositories/IUserRepository";
import { inject } from "tsyringe";
import { User } from "modules/users/infra/typeorm/entities/Users";
import { AppError } from "shared/errors/AppError";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface ILoginDTO {
  login: string;
  password: string;
}

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
    const auth = await compare(password, user.password);
    const token = sign({}, "74EBC35C58A5049F0F271EBF6F78CC8F", {
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
