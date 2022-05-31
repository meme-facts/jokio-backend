import { IFollowerDTO } from "@modules/users/dtos/ICreateFollowerDTO";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class RemoveRelationUseCase {
  constructor(
    @inject("FollowersRepository")
    private followersRepository: IFollowersRepository
  ) {}
  async execute({
    requestedUserId,
    requesterUserId,
  }: Omit<IFollowerDTO, "id" | "fStatus">): Promise<void> {
    const relation = await this.followersRepository.getSolicitation(
      requestedUserId,
      requesterUserId
    );
    if (!relation) {
      throw new AppError("Relation not found.", 404);
    }
    await this.followersRepository.delete(relation);
  }
}

export { RemoveRelationUseCase };
