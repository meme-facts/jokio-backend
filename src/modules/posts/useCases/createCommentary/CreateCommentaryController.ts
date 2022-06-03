import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCommentaryUseCase } from "./CreateCommentaryUseCase";

class CreateCommentaryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { id: postId } = request.params;
    const { message } = request.body;
    console.log(userId, postId, message);
    const createCommentaryUseCase = container.resolve(CreateCommentaryUseCase);
    await createCommentaryUseCase.execute({
      userId,
      postId,
      message,
    });
    return response.status(201).send();
  }
}

export { CreateCommentaryController };
