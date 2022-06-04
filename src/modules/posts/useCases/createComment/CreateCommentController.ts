import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCommentUseCase } from "./CreateCommentUseCase";

class CreateCommentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { id: postId } = request.params;
    const { message } = request.body;
    console.log(userId, postId, message);
    const createCommentaryUseCase = container.resolve(CreateCommentUseCase);
    await createCommentaryUseCase.execute({
      userId,
      postId,
      message,
    });
    return response.status(201).send();
  }
}

export { CreateCommentController };
