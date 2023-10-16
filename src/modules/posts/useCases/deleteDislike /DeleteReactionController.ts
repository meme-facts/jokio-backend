import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteDislikeUseCase } from "./DeleteReactionUseCase";

class DeleteDislikeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: postId } = request.params;
    const { id: userId } = request.user;

    const deleteReactionUseCase = container.resolve(DeleteDislikeUseCase);
    await deleteReactionUseCase.execute({ postId, userId });
    return response.status(204).send();
  }
}

export { DeleteDislikeController };
