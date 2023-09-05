import { IUserRepository } from "../../repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { User } from "../../../users/infra/typeorm/entities/Users";
import { AppError } from "../../../../shared/errors/AppError";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { users } from "@prisma/client";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { IUserDTO } from "@modules/users/dtos/ICreateUsersDTO";
import * as admin from "firebase-admin";

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
  }: ILoginDTO): Promise<{ user: users; token: string }> {
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
  async google(tokenId: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(tokenId);
      const { uid, email, name, picture } = decodedToken;

      let user = await this.userRepository.getByNicknameOrEmail(email);
      if (!user) {
        const createdUser = await this.createUser.execute({
          email,
          nickname: name,
          password: uid,
          image_url: picture,
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
      throw new AppError("Error with Google login:");
    }
  }
}

export { AuthenticateUserUseCase };
