import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { IPostDTO } from "@modules/posts/dtos/IPostDTO";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { Prisma, PrismaClient, posts } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

class PostRepository implements IPostRepository {
  private repository: Prisma.postsDelegate<DefaultArgs>;
  constructor() {
    this.repository = new PrismaClient().posts;
  }

  async create({
    postDescription,
    user_id,
    img_url,
  }: IPostDTO): Promise<posts> {
    return this.repository.create({
      data: {
        postDescription,
        user_id,
        img_url,
        isActive: true,
      },
    });
  }
  async getById(id: string): Promise<posts> {
    const post = await this.repository.findFirst({
      where: {
        id,
      },
    });
    return post;
  }
  async getAll({
    page,
    limit,
  }: IGetPostsDTO): Promise<{ posts: posts[]; count: number }> {
    const offset: number = (page - 1) * limit;
    const count = await this.repository.count({
      where: {
        users: {
          isPrivate: false,
        },
      },
    });
    const posts = await this.repository.findMany({
      include: {
        users: true,
      },
      where: {
        users: {
          isPrivate: false,
        },
      },
      skip: offset,
      take: limit,
      orderBy: {
        updated_at: "desc",
      },
    });
    return { posts, count };
  }
  async getAllByUserId({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: posts[]; count: number }> {
    const offset: number = (page - 1) * limit;
    const count = await this.repository.count({
      where: {
        users: {
          id: user_id,
        },
      },
    });
    const posts = await this.repository.findMany({
      include: {
        users: true,
      },
      where: {
        users: {
          id: user_id,
        },
      },
      skip: offset,
      take: limit,
      orderBy: {
        updated_at: "desc",
      },
    });
    return { posts, count };
  }

  async getByUser({
    page,
    limit,
    user_id,
  }: IGetPostsDTO): Promise<{ posts: posts[]; count: number }> {
    const offset: number = (page - 1) * limit;

    const [count, posts] = await Promise.all([
      this.repository.count({
        where: {
          users: {
            followers_followers_requesterUserIdTousers: {
              some: {
                id: user_id,
              },
            },
          },
        },
      }),
      this.repository.findMany({
        where: {
          users: {
            followers_followers_requesterUserIdTousers: {
              some: {
                id: user_id,
              },
            },
          },
        },
        take: limit,
        skip: offset,
        orderBy: {
          updated_at: "desc",
        },
      }),
    ]);
    return {
      posts,
      count,
    };
  }
}

export { PostRepository };
