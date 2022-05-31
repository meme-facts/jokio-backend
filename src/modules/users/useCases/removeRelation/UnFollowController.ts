import { Request, Response } from "express";
import { container } from "tsyringe";
import { RemoveRelationUseCase } from "./RemoveRelationUseCase";

class UnFollowController {
  async handle(request: Request, response: Response) {
    const { id: requesterUserId } = request.user;
    const { id: requestedUserId } = request.params;
    const removeRelationUseCase = container.resolve(RemoveRelationUseCase);
    await removeRelationUseCase.execute({
      requestedUserId,
      requesterUserId,
    });
    return response.status(204).send();
  }
}

export { UnFollowController };
