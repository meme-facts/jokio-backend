import { Request, Response } from "express";
import { container } from "tsyringe";
import { RequestUserToFollowUseCase } from "./RequestUserToFollowUseCase";
import { validateAndTransformData } from "@shared/infra/http/middlewares/helpers/validators/TransformAndValidate";
import { CreateFollowerDTO } from "@modules/users/infra/class-validator/follower/CreateFollower.dto";

class RequestUserToFollowController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: requestedUserId } = request.params;
    const { id: requesterUserId } = request.user;
    const requestUserToFollowUseCase = container.resolve(
      RequestUserToFollowUseCase
    );
    const createRequest = await validateAndTransformData(CreateFollowerDTO, {
      requestedUserId,
      requesterUserId,
    });
    await requestUserToFollowUseCase.execute(createRequest);
    return response.status(201).send();
  }
}

export { RequestUserToFollowController };
