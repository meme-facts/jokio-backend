import { Request, Response } from "express";
import { container } from "tsyringe";
import { RequestUserToFollowUseCase } from "./RequestUserToFollowUseCase";

interface IRequest {
  requestedUserId: string;
  requesterUserId: string;
}

class RequestUserToFollowController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: requestedUserId } = request.params;
    const { id: requesterUserId } = request.user;
    const requestUserToFollowUseCase = container.resolve(
      RequestUserToFollowUseCase
    );
    await requestUserToFollowUseCase.execute(requestedUserId, requesterUserId);
    return response.status(200).send();
  }
}

export { RequestUserToFollowController };
