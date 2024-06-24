import { Request, Response } from "express";
import { container } from "tsyringe";
import { CheckEmailAvailabilityUseCase } from "./CheckEmailAvailabilityUseCase";

export class CheckEmailAvailabilityController {
  async handle(
    request: Request,
    response: Response
  ): Promise<Response<Boolean>> {
    const checkEmailAvailabilityUserCase = container.resolve(
      CheckEmailAvailabilityUseCase
    );

    const isAvailable = await checkEmailAvailabilityUserCase.execute({
      email: request.params.email,
      loggedUserId: request.user.id,
    });

    return response.json(isAvailable);
  }
}
