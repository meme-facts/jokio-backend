import { ISharePostWithMultipleUsersDTO } from "@modules/posts/dtos/ISharePostWithMultipleUsersDTO";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { EPostRepositories } from "@shared/container/posts/post.enum";
import { EUserRepositories } from "@shared/container/users/user.enum";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
export class SharePostWithMultipleUsersUseCase {
  constructor(
    @inject(EPostRepositories.PostRepository)
    private postRepository: IPostRepository,
    @inject(EUserRepositories.UserRepository)
    private usersRepository: IUserRepository,
    @inject(EUserRepositories.MessagesRepository)
    private messagesRepository: IMessagesRepository
  ) {}

  async execute(params: ISharePostWithMultipleUsersDTO): Promise<void> {
    const { postId, usersIds, fromUserId } = params;
    const post = await this.postRepository.getById(postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    const loggedUser = await this.usersRepository.getById(fromUserId);
    if (!loggedUser) {
      throw new AppError("Sender not found", 404);
    }
    const targetUsers = await this.usersRepository.getManyByIds(usersIds);
    if (targetUsers.length !== usersIds.length) {
      throw new AppError("One or more receivers not found", 404);
    }
    if (usersIds.includes(fromUserId)) {
      throw new AppError("You can't share a post with yourself", 403);
    }

    await this.messagesRepository.createMany(
      usersIds.map((toUserId) => {
        return {
          fromUserId,
          toUserId,
          message: post.id,
        };
      })
    );
  }
}
