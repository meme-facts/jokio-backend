import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetPendingRelationsByUserUseCase } from "./GetPendingRelationsByUserUseCase";

class GetPendingRelationsByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { page, limit } = request.query;
    const getPendingRelationsByUserUseCase = container.resolve(
      GetPendingRelationsByUserUseCase
    );
    const pendingRelations = await getPendingRelationsByUserUseCase.execute({
      page: Number(page),
      limit: limit ? Number(limit) : 5,
      userId,
    });
    return response.status(200).json(pendingRelations);
  }
}

export { GetPendingRelationsByUserController };
