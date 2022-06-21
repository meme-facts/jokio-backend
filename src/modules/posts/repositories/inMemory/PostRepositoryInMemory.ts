import { IGetPostsDTO } from "@modules/posts/dtos/IGetPostsDTO";
import { IPostDTO } from "@modules/posts/dtos/IPostDTO";
import { ReactionTypeEnum } from "@modules/posts/enums/ReactionTypeEnum";
import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { PostReaction } from "@modules/posts/infra/typeorm/entities/PostReactions";
import { IPostRepository } from "../IPostRepository";

interface;

class PostRepositoryInMemory implements IPostRepository {
  posts: Post[] = [];
  async create({ postDescription, user_id, img_url }: IPostDTO): Promise<Post> {
    const post = new Post();
    Object.assign(post, {
      postDescription,
      user_id,
      img_url,
    });
    this.posts.push(post);
    return post;
  }
  async getById(postId: string): Promise<Post> {
    return this.posts.find((post) => post.id === postId);
  }
  async getAll({ page, limit, user_id }: IGetPostsDTO): Promise<Post[]> {
    let response;
    if (user_id) {
      response = this.posts.filter((post) => post.user_id === user_id);
    } else {
      response = this.posts;
    }
    const paginatedValues: Post[] = response.slice(
      (page - 1) * limit,
      page * limit
    );

    const finalValue: {
      post: Post;
      reactionsQuantity: { likes: number; dislikes: number };
    } = paginatedValues.map((post) => {
      let reactionsQuantity: { likes: number; dislikes: number };
      post.postReaction.map((reaction) => {
        if (reaction.reactionType === ReactionTypeEnum.Like) {
          reactionsQuantity.likes += 1;
        } else {
          reactionsQuantity.dislikes += 1;
        }
        return {
          ...post,
          reactionsQuantity,
        };
      });
    });
    return finalValue;
  }
  async insertReaction(
    postId: string,
    userId: string,
    reactionType: string
  ): Promise<void> {
    const postReactions = new PostReaction();
    postReactions.reactionType = reactionType;
    postReactions.userId = userId;
    postReactions.postId = postId;
    const post = this.posts.find((post) => post.id === postId);
    post.postReaction.push(postReactions);
  }
}

export { PostRepositoryInMemory };
