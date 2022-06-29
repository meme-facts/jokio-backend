import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { IPostDTO } from "@modules/posts/dtos/IPostDTO";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { getRepository, Repository } from "typeorm";
import { Post } from "../entities/Post";

class PostRepository implements IPostRepository {
  repository: Repository<Post>;
  constructor() {
    this.repository = getRepository(Post);
  }

  async create({ postDescription, user_id, img_url }: IPostDTO): Promise<Post> {
    const post = this.repository.create({
      postDescription,
      user_id,
      img_url,
    });
    await this.repository.save(post);
    return post;
  }
  async getById(postId: string): Promise<Post> {
    const post = await this.repository.findOne(postId);
    return post;
  }
  async getAll({ page, limit }: IGetPostsDTO): Promise<Post[]> {
    const offset: number = (page - 1) * limit;
    const posts = await this.repository.find({
      where: {
        user: {
          isPrivate: false,
        },
      },
      skip: offset,
      take: limit,
      relations: ["user"],
      order: {
        updated_at: "DESC",
      },
    });
    return posts;
  }
}

export { PostRepository };
