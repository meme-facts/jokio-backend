import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetAllUsersUseCase } from "./GetAllUsersUseCase";

class GetAllUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getAllUsersUseCase = container.resolve(GetAllUsersUseCase);
    const { page, limit, user_reference } = request.query;
    const { users, count } = await getAllUsersUseCase.execute({
      page: Number(page),
      limit: limit ? Number(limit) : 10,
      user_reference:user_reference ? String(user_reference) : undefined,
    });
    return response.status(200).json({
      users,
      count,
    });
  }
}

export { GetAllUsersController }
