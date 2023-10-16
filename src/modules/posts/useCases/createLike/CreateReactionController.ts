import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateLikeUseCase } from "./CreateReactionUseCase";

class CreateLikeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { id: postId } = request.params;
    const createReactionUseCase = container.resolve(CreateLikeUseCase);

    await createReactionUseCase.execute({
      postId,
      userId,
    });

    return response.status(201).send();
  }
}

export { CreateLikeController };
