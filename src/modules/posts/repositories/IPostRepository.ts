import { Post } from "../infra/typeorm/entities/Post";


interface IPostRepository {
    create({}):Promise<Post>
}