import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetAllFollowingUseCase } from "./GetAllFollowingUseCase";

class GetAllFollowingController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getAllUsersUseCase = container.resolve(GetAllFollowingUseCase);
    const { page, limit, user_reference } = request.query;
    const { id } = request.user;
    const { users, count } = await getAllUsersUseCase.execute({
      page: Number(page),
      limit: limit ? Number(limit) : 10,
      user_reference: user_reference ? String(user_reference) : undefined,
      following_id: id,
    });
    return response.status(200).json({
      users,
      count,
    });
  }
}

export { GetAllFollowingController };
