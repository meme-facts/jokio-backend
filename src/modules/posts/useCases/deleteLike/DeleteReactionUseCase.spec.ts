import { ReactionTypeEnum } from "@modules/posts/enums/ReactionTypeEnum";
import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { PostReaction } from "@modules/posts/infra/typeorm/entities/PostReactions";
import { PostReactionsRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostReactionsRepositoryInMemory";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";
import { CreateLikeUseCase } from "../createLike/CreateReactionUseCase";
import { IPostLikeRepository } from "@modules/posts/repositories/IPostLikeRepository";
import { DeleteLikeUseCase } from "./DeleteReactionUseCase";
import { UserEntity } from "@modules/users/entities/User";
import { PostEntity } from "@modules/posts/entities/Post";
import { PostLikeEntity } from "@modules/posts/entities/Like";

let userRepositoryInMemory: UserRepositoryInMemory;
let postRepositoryInMemory: PostRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let createPostUseCase: CreatePostUseCase;
let createReactionUseCase: CreateLikeUseCase;
let reactionRepository: IPostLikeRepository;
let deleteReaction: DeleteLikeUseCase;
let user1: UserEntity;
let user2: UserEntity;
let post: PostEntity;
let reactionOne: PostLikeEntity;
let reactionTwo: PostLikeEntity;

describe("CreateCommentaryUseCase", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    postRepositoryInMemory = new PostRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    createPostUseCase = new CreatePostUseCase(
      postRepositoryInMemory,
      userRepositoryInMemory
    );
    reactionRepository = new PostReactionsRepositoryInMemory();
    deleteReaction = new DeleteLikeUseCase(
      reactionRepository,
      postRepositoryInMemory
    );
    const firstUserTest = await createUserUseCase.execute({
      full_name: "opateste",
      nickname: "teste",
      email: "silva@teste.com",
      password: "1234",
    });
    const secondUserTest = await createUserUseCase.execute({
      full_name: "opateste2",
      nickname: "teste2",
      email: "silva2@teste.com",
      password: "1234",
    });
    user1 = firstUserTest.user;
    user2 = secondUserTest.user;
    post = await createPostUseCase.execute({
      postDescription: "olha ai um teste chegando",
      user_id: user1.id,
      img_url: "https://i.ytimg.com/vi/C_73egXn3bs/maxresdefault.jpg",
    });
    createReactionUseCase = new CreateLikeUseCase(
      reactionRepository,
      postRepositoryInMemory
    );
    await createReactionUseCase.execute({
      postId: post.id,
      userId: user1.id,
    });
    const reactions = await reactionRepository.getAll();
    reactionOne = reactions[0];
    reactionTwo = reactions[1];
  });

  it("should be able to delete a reaction type like", async () => {
    ("");
    await createReactionUseCase.execute({
      postId: post.id,
      userId: user1.id,
    });
    const reactionsAfterCreationLength = (await reactionRepository.getAll())
      .length;
    await deleteReaction.execute({
      postId: post.id,
      userId: user1.id,
    });
    const reactions = await reactionRepository.getAll();
    expect(reactions.length).toEqual(reactionsAfterCreationLength - 1);
  });
  it("should decrement like count on posts when like it", async () => {
    await createReactionUseCase.execute({
      postId: post.id,
      userId: user1.id,
    });
    const reactionsAfterCreationLength = (await reactionRepository.getAll())
      .length;
    await deleteReaction.execute({
      postId: post.id,
      userId: user1.id,
    });
    expect(post.likeCount).toEqual(reactionsAfterCreationLength - 1);
  });

  it("should return error when try to delete a reaction that does not exists", async () => {
    await expect(
      deleteReaction.execute({
        postId: "wrong_id",
        userId: user1.id,
      })
    ).rejects.toEqual(new AppError("Reaction not found", 404));
  });
});
