import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetFollowersByUserUseCase } from "./getFollowersByUserUseCase";

class GetFollowersByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page, limit, sortBy } = request.query;
    const { id } = request.params;

    const getFollowingUseCase = container.resolve(GetFollowersByUserUseCase);

    const following = await getFollowingUseCase.execute({
      page: +page,
      limit: limit ? +limit : undefined,
      userId: id,
      sortBy: sortBy ? String(sortBy) : undefined,
    });

    return response.json(following);
  }
}

export { GetFollowersByUserController };
