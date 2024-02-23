import { container } from "tsyringe";
import { GetAllConversationsUseCase } from "./GetAllConversationsUseCase";
import { Request, Response } from "express";

export class GetAllConversationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const getAllConversationsUseCase = container.resolve(
      GetAllConversationsUseCase
    );
    const conversations = await getAllConversationsUseCase.execute({ userId });
    return response.status(200).json(conversations);
  }
}
