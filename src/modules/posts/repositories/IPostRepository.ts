import { IGetPostsDTO } from "../dtos/IGetPostsDTO";
import { IPostDTO } from "../dtos/IPostDTO";
import { Post } from "../infra/typeorm/entities/Post";

interface IPostRepository {
  create({ postDescription, user_id, img_url }: IPostDTO): Promise<Post>;
  getById(postId: string): Promise<Post>;
  getAll({ page, limit }: IGetPostsDTO): Promise<Post[]>;
  getByUser({ page, limit, user_id }: IGetPostsDTO);
}

export { IPostRepository };
