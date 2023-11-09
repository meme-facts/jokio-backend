import { Request, Response } from "express";
import { container } from "tsyringe";
import { ReturnPostByIdUseCase } from "./ReturnPostByIdUseCase";

class ReturnPostByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: postId } = request.params;
    const { id: userId } = request.user;
    console.log(postId);
    const returnPostByIdUseCase = container.resolve(ReturnPostByIdUseCase);
    const post = await returnPostByIdUseCase.execute({
      postId,
      loggedUserId: userId,
    });
    return response.status(200).json(post);
  }
}
export { ReturnPostByIdController };
