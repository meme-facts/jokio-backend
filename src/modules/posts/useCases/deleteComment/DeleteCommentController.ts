import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteCommentUseCase } from "./DeleteCommentUseCase";

class DeleteCommentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: commentId } = request.params;
    const { id: userId } = request.user;
    const deleteCommentUseCase = container.resolve(DeleteCommentUseCase);
    await deleteCommentUseCase.execute(commentId, userId);
    return response.status(204).send();
  }
}

export { DeleteCommentController };
