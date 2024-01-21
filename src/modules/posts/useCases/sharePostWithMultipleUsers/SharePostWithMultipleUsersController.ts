import { Request, Response } from "express";
import { SharePostWithMultipleUsersUseCase } from "./SharePostWithMultipleUsersUseCase";
import { container } from "tsyringe";
import { SharePostWithMultipleUsersDTO } from "@modules/posts/infra/class-validator/posts/SharePostWithMultipleUsers.dto";
import { validateAndTransformData } from "@shared/infra/http/middlewares/helpers/validators/TransformAndValidate";

export class SharePostWithMultipleUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: fromUserId } = request.user;
    const { id: postId } = request.params;
    const { usersIds } = request.body;

    const parsed = await validateAndTransformData(
      SharePostWithMultipleUsersDTO,
      {
        postId,
        fromUserId,
        usersIds,
      }
    );
    const sharePostWithMultipleUsersUseCase = container.resolve(
      SharePostWithMultipleUsersUseCase
    );

    await sharePostWithMultipleUsersUseCase.execute({
      postId: parsed.postId,
      fromUserId: parsed.fromUserId,
      usersIds: parsed.usersIds,
    });

    return response.status(200).send();
  }
}
