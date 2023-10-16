import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteLikeUseCase } from "./DeleteReactionUseCase";

class DeleteLikeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: postId } = request.params;
    const { id: userId } = request.user;

    const deleteReactionUseCase = container.resolve(DeleteLikeUseCase);
    await deleteReactionUseCase.execute({ postId, userId });
    return response.status(204).send();
  }
}

export { DeleteLikeController };
