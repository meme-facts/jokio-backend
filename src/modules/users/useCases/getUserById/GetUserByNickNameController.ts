import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetUserByNickNameUseCase } from "./GetUserByNickNameUseCase";

class GetUserByNickNameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: loggedUserId } = request.user;
    const { id: requestedUserNickName } = request.params;

    const getUserByIDUseCase = container.resolve(GetUserByNickNameUseCase);
    const user = await getUserByIDUseCase.execute({
      loggedUserId,
      requestedUserNickName,
    });

    return response.status(200).json(user);
  }
}

export { GetUserByNickNameController };
