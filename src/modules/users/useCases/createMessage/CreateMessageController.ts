import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateMessageUseCase } from "./CreateMessageUserCase";
import { validateAndTransformData } from "@shared/infra/http/middlewares/helpers/validators/TransformAndValidate";
import { CreateMessageInputDTO } from "@modules/users/infra/class-validator/messages/CreateMessageInput.dto";

export class CreateMessageController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: fromUserId } = request.user;
    const { id: toUserId } = request.params;
    const { message } = request.body;
    const parsed = await validateAndTransformData(CreateMessageInputDTO, {
      message,
      fromUserId,
      toUserId,
    });
    const createMessageUseCase = container.resolve(CreateMessageUseCase);

    const createdMessage = await createMessageUseCase.execute(parsed);

    return response.status(201).json(createdMessage);
  }
}
