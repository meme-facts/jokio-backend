import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { IPostDTO } from "@modules/posts/dtos/IPostDTO";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { getRepository, In, Repository } from "typeorm";
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
  async getAll({
    page,
    limit,
  }: IGetPostsDTO): Promise<{ posts: Post[]; count: number }> {
    const offset: number = (page - 1) * limit;
    const count = await this.repository.count({
      join: {
        alias: "post",
        innerJoin: {
          user: "post.user",
        },
      },
      where: {
        user: {
          isPrivate: false,
        },
      },
    });
    const posts = await this.repository.find({
      join: {
        alias: "post",
        innerJoin: {
          user: "post.user",
        },
      },
      where: {
        user: {
          isPrivate: false,
        },
      },
      skip: offset,
      take: limit,
      order: {
        updated_at: "DESC",
      },
    });
    return { posts, count };
  }
  async getAllByUserId({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: Post[]; count: number }> {
    const offset: number = (page - 1) * limit;
    const count = await this.repository.count({
      join: {
        alias: "post",
        innerJoin: {
          user: "post.user",
        },
      },
      where: {
        user: {
          id: user_id,
        },
      },
    });
    const posts = await this.repository.find({
      join: {
        alias: "post",
        innerJoin: {
          user: "post.user",
        },
      },
      where: {
        user: {
          id: user_id,
        },
      },
      skip: offset,
      take: limit,
      order: {
        updated_at: "DESC",
      },
    });
    return { posts, count };
  }

  async getByUser({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: Post[]; count: number }> {
    const offset: number = (page - 1) * limit;

    const count = await this.repository
      .createQueryBuilder("post")
      .innerJoin("post.user", "user")
      .innerJoin("user.followers", "followers")
      .where("followers.requesterUserId = :id", { id: user_id })
      .getCount();

    const posts = await this.repository
      .createQueryBuilder("post")
      .innerJoin("post.user", "user")
      .innerJoin("user.followers", "followers")
      .where("followers.requesterUserId = :id", { id: user_id })
      .skip(offset)
      .take(limit)
      .orderBy("post.updated_at", "DESC")
      .getMany();
    return {
      posts,
      count,
    };
  }
}

export { PostRepository };
