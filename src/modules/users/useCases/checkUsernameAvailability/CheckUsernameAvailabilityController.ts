import { Request, Response } from "express";
import { container } from "tsyringe";
import { CheckUsernameAvailabilityUseCase } from "./CheckUsernameAvailabilityUseCase";

export class CheckUsernameAvailabilityController {
  async handle(
    request: Request,
    response: Response
  ): Promise<Response<Boolean>> {
    const checkUsernameAvailabilityUserCase = container.resolve(
      CheckUsernameAvailabilityUseCase
    );

    const isAvailable = await checkUsernameAvailabilityUserCase.execute({
      nickname: request.params.nickname,
      loggedUserId: request.user.id,
    });

    return response.json(isAvailable);
  }
}
