import { IUpdateRelationDTO } from "@modules/users/dtos/IUpdateRelationsDTO";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { StatusEnum } from "@shared/enums/StatusEnum";
import { AppError } from "@shared/errors/AppError";
import { relative } from "path";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateFollowerStatusUseCase {
constructor(
    @inject('FollowersRepository')
    private followerRepository: IFollowersRepository
){}
    async execute({fStatus,requestedUserId,requesterUserId}:IUpdateRelationDTO):Promise<void> {
        const relation = await this.followerRepository.getSolicitation(requestedUserId,requesterUserId)
        if(!relation){
            throw new AppError('Relation not found', 404);
        }
        relation.fStatus = StatusEnum.Accepted;
    }
}

export { UpdateFollowerStatusUseCase }