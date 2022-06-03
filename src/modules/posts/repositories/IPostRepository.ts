import { IPostDTO } from "../dtos/IPostDTO";
import { Post } from "../infra/typeorm/entities/Post";

interface IPostRepository {
  create({ postDescription, user_id, img_url }: IPostDTO): Promise<Post>;
  getById(postId: string): Promise<Post>;
}

export { IPostRepository };
