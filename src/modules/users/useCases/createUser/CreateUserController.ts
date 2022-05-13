import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateUserUseCase } from "./CreateUserUseCase";

interface IUserResponse {
  id: string;
  nickname: string;
  email: string;
  token: string;
}

class CreateUserController {
  async handle(
    request: Request,
    response: Response
  ): Promise<Response<IUserResponse>> {
    const createUserUseCase = container.resolve(CreateUserUseCase);
    const { fullName, nickname, email, password } = request.body;
    const { token, user } = await createUserUseCase.execute({
      fullName,
      nickname,
      email,
      password,
    });
    return response.status(201).json({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      token,
    });
  }
}

export { CreateUserController };
