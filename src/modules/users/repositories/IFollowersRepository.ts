import { Follower } from "../infra/typeorm/entities/Followers"

interface IFollowersRepository {
    create(requestedUserId: string, requesterUserId:string):Promise<void>
    getAll():Promise<Follower[]>;
    getSolicitation(requestedUserId: string, requesterUserId:string): Promise<Follower>;
}

export {IFollowersRepository}