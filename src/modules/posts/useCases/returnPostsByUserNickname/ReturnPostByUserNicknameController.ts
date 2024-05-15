import { Request, Response } from "express";
import { container } from "tsyringe";
import { ReturnPostByUserNicknameUseCase } from "./ReturnPostByUserNicknameUseCase";
import { validateAndTransformData } from "@shared/infra/http/middlewares/helpers/validators/TransformAndValidate";
import { ReturnPostsByUserNicknameInputDTO } from "@modules/posts/infra/class-validator/posts/ReturnPostsByUserNicknameInput.dto";

class ReturnPostByUserNicknameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page, limit } = request.query;

    const { nickname: userName } = request.params;
    const { id: logged_user_id } = request.user;
    const returnPostUseCase = container.resolve(
      ReturnPostByUserNicknameUseCase
    );
    const parsed = await validateAndTransformData(
      ReturnPostsByUserNicknameInputDTO,
      {
        page: Number(page),
        limit: Number(limit),
        userName,
        logged_user_id,
      }
    );
    const posts = await returnPostUseCase.execute(parsed);
    return response.status(200).json(posts);
  }
}
export { ReturnPostByUserNicknameController };
