import { Follower } from "../infra/typeorm/entities/Followers"

interface IFollowersRepository {
    create(requestedUserId: string, requesterUserId:string):Promise<void>
    getAll():Promise<Follower[]>;
}

export {IFollowersRepository}