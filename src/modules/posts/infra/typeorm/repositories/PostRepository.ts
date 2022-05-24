import { IPostDTO } from "@modules/posts/dtos/IPostDTO";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { getRepository, Repository } from "typeorm";
import { Post } from "../entities/Post";


class PostReposotory implements IPostRepository {

  repository: Repository<Post>;
  constructor() {
    this.repository = getRepository(Post);
  }
    async create({ postDescription, user_id, img_url }: IPostDTO): Promise<Post> {
        const post = this.repository.create({
            postDescription,
            user_id,
            img_url
        })
        await this.repository.save(post)
        return post;
    }

}

export { PostReposotory }