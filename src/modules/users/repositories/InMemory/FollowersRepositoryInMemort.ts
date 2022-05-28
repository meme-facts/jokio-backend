import { Follower } from "@modules/users/infra/typeorm/entities/Followers";
import { IFollowersRepository } from "../IFollowersRepository";

class FollowersRepositoryInMemory implements IFollowersRepository {
 
    followers: Follower[] = [];
    async getAll(): Promise<Follower[]> {
        return this.followers
     }
    async create(requestedUserId: string, requesterUserId: string): Promise<void> {
        const followRelation = new Follower();
        Object.assign(followRelation,{
            requestedUserId,
            requesterUserId
        })
        this.followers.push(followRelation)
    }

}

export { FollowersRepositoryInMemory }