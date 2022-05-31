import { IUpdateRelationDTO } from "@modules/users/dtos/IUpdateRelationsDTO";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateFollowerStatusUseCase {
  constructor(
    @inject("FollowersRepository")
    private followerRepository: IFollowersRepository
  ) {}
  async execute({
    fStatus,
    requestedUserId,
    requesterUserId,
  }: IUpdateRelationDTO): Promise<void> {
    const relation = await this.followerRepository.getSolicitation(
      requestedUserId,
      requesterUserId
    );
    if (!relation) {
      throw new AppError("Relation not found.", 404);
    }
    relation.fStatus = fStatus;
    await this.followerRepository.create(relation);
  }
}

export { UpdateFollowerStatusUseCase };
