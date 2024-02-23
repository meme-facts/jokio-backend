import { UserEntity } from "@modules/users/entities/User";
import { compare } from "bcryptjs";
import * as admin from "firebase-admin";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { IAuthenticateUserResponseDTO } from "@modules/users/dtos/IAuthenticateUserResponseDTO";
import { plainToInstance } from "class-transformer";
import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";

interface ILoginDTO {
  login: string;
  password: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    private createUser: CreateUserUseCase
  ) {}

  async execute({
    login,
    password,
  }: ILoginDTO): Promise<IAuthenticateUserResponseDTO> {
    const user = await this.userRepository.getByNicknameOrEmail(login);
    if (!user) {
      throw new AppError("Login or password incorrect.", 401);
    }
    const passwordHasMatch = await compare(password, user.password);
    if (!passwordHasMatch) {
      throw new AppError("Login or password incorrect.", 401);
    }
    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "1d",
    });
    return {
      token,
      user: plainToInstance(UserDto, user),
    };
  }
  async google(tokenId: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(tokenId);
      const { uid, email, name, picture } = decodedToken;

      let user = await this.userRepository.getByNicknameOrEmail(email);
      if (!user) {
        const createdUser = await this.createUser.execute({
          email,
          full_name: name,
          nickname: email.split("@")[0],
          password: uid,
          img_url: picture,
          isPrivate: false,
        });
        user = createdUser.user;
      }
      const token = sign({}, process.env.JWT_SECRET, {
        subject: user.id,
        expiresIn: "1d",
      });
      return {
        token,
        user,
      };
    } catch (error) {
      throw new AppError("Error with Google login: " + error);
    }
  }
}

export { AuthenticateUserUseCase };
