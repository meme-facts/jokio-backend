import { PostEntity } from "../entities/Post";

export class IGetAllPostResponseDto extends PostEntity {
  likedByLoggedUser: boolean;
  dislikedByLoggedUser: boolean;
}
