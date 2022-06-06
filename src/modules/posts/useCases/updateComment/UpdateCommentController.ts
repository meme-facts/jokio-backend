import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateCommentUseCase } from "./UpdateCommentUseCase";

class UpdateCommentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { message } = request.body;
    const { id: userId } = request.user;
    const updateCommentUseCase = container.resolve(UpdateCommentUseCase);
    await updateCommentUseCase.execute({
      id,
      message,
      userId,
    });
    return response.status(204).send();
  }
}

export { UpdateCommentController };
