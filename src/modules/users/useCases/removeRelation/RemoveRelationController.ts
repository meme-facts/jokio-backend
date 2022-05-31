import { Request, Response } from "express";
import { container } from "tsyringe";
import { RemoveRelationUseCase } from "./RemoveRelationUseCase";

class RemoveRelationController {
  async handle(request: Request, response: Response) {
    const { id: requestedUserId } = request.user;
    const { id: requesterUserId } = request.params;
    const removeRelationUseCase = container.resolve(RemoveRelationUseCase);
    await removeRelationUseCase.execute({
      requestedUserId,
      requesterUserId,
    });
    return response.status(204).send();
  }
}

export { RemoveRelationController };
