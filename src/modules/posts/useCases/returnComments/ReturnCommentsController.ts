import { Request, Response } from "express";
import { container } from "tsyringe";
import { ReturnCommentsUseCase } from "./ReturnCommentsUseCase";

class ReturnCommentsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: postId } = request.params;
    const { page, limit } = request.query;

    const returnCommentsUseCase = container.resolve(ReturnCommentsUseCase);
    const comments = await returnCommentsUseCase.execute({
      page: +page,
      limit: +limit,
      postId,
    });
    return response.status(200).json(comments);
  }
}

export { ReturnCommentsController };
