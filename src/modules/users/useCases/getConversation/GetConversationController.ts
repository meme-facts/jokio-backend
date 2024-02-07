import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetConversationUseCase } from "./GetConversationUseCase";
import { validateAndTransformData } from "@shared/infra/http/middlewares/helpers/validators/TransformAndValidate";
import { GetConversationInputDTO } from "@modules/users/infra/class-validator/messages/GetConversationInput.dto";

export class GetConversationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: loggedUserId } = request.user;
    const { id: targetUserId } = request.params;
    const { offset, limit } = request.query;
    const parsed = await validateAndTransformData(GetConversationInputDTO, {
      loggedUserId,
      targetUserId,
      offset: Number(offset),
      limit: Number(limit),
    });
    const getConversationUseCase = container.resolve(GetConversationUseCase);

    const conversation = await getConversationUseCase.execute(parsed);

    return response.status(200).json(conversation);
  }
}
