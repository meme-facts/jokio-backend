import { Request, Response } from "express";
import { container } from "tsyringe";
import { ReturnPostByUsersUseCase } from "./ReturnPostByUsersUseCase";

class ReturnPostByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page, limit } = request.query;

    const { id: user_id } = request.user;
    const returnPostUseCase = container.resolve(ReturnPostByUsersUseCase);
    const posts = await returnPostUseCase.execute({
      page: +page,
      limit: +limit,
      user_id,
    });
    return response.status(200).json(posts);
  }
}
export { ReturnPostByUserController };
