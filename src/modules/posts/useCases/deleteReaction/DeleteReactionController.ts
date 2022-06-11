import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteReactionUseCase } from "./DeleteReactionUseCase";

class DeleteReactionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteReactionUseCase = container.resolve(DeleteReactionUseCase);
    await deleteReactionUseCase.execute(id);
    return response.status(204).send();
  }
}

export { DeleteReactionController };
