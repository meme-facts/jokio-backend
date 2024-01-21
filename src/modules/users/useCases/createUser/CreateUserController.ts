import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { validate } from "class-validator";
import { validateAndTransformData } from "@shared/infra/http/middlewares/helpers/validators/TransformAndValidate";
import { CreateUserDTO } from "@modules/users/infra/class-validator/user/CreateUsers.dto";

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
    const { full_name, nickname, email, password } = request.body;
    const parsedUser = await validateAndTransformData(CreateUserDTO, {
      full_name,
      nickname,
      email,
      password,
    });
    const { token, user } = await createUserUseCase.execute(parsedUser);
    return response.status(201).json({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      token,
    });
  }
}

export { CreateUserController };
