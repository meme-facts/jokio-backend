import { StatusEnum } from "@shared/enums/StatusEnum";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateFollowerStatusUseCase } from "./UpdateFollowerStatusUseCase";

class UpdateFollowerStatusController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: requestedUserId } = request.user;
    const { id: requesterUserId, status: fStatus } = request.query;
    const updateFollowerStatusUseCase = container.resolve(
      UpdateFollowerStatusUseCase
    );
    await updateFollowerStatusUseCase.execute({
      fStatus: fStatus as StatusEnum,
      requestedUserId,
      requesterUserId: requesterUserId as string,
    });
    return response.status(204).send();
  }
}

export { UpdateFollowerStatusController };
