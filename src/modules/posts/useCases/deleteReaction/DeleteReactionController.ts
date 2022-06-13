import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteReactionUseCase } from "./DeleteReactionUseCase";

class DeleteReactionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: postId } = request.params;
    const { reactionType } = request.body;
    const { id: userId } = request.user;
    console.log(postId);
    const deleteReactionUseCase = container.resolve(DeleteReactionUseCase);
    await deleteReactionUseCase.execute({ postId, reactionType, userId });
    return response.status(204).send();
  }
}

export { DeleteReactionController };
