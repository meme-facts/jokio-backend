import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const updateUserUseCase = container.resolve(UpdateUserUseCase);
    const { id, full_name, nickname, email } = request.body;
    await updateUserUseCase.execute({
      id,
      full_name,
      nickname,
      email,
    });
    return response.status(201).send();
  }
}

export { UpdateUserController };
