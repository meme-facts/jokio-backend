import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IUserResponse } from "@modules/users/dtos/IAuthenticateUserResponseDTO";

class AuthenticateUserController {
  async handle(
    request: Request,
    response: Response
  ): Promise<Response<IUserResponse>> {
    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);
    const { login, password } = request.body;

    const { token, user } = await authenticateUserUseCase.execute({
      login,
      password,
    });

    return response.status(200).json({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      token,
    });
  }

  async google(request: Request, response: Response) {
    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);
    const { idToken } = request.body._tokenResponse; // The ID token obtained from the frontend
    const { token, user } = await authenticateUserUseCase.google(idToken);

    return response.status(200).json({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      token,
    });
  }
}

export { AuthenticateUserController };
