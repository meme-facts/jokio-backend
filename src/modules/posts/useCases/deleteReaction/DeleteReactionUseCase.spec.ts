import { ReactionTypeEnum } from "@modules/posts/enums/ReactionTypeEnum";
import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { PostReaction } from "@modules/posts/infra/typeorm/entities/PostReactions";
import { PostReactionsRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostReactionsRepositoryInMemory";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { IPostReactionRepository } from "@modules/posts/repositories/IPostReactionRepository";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";
import { CreateReactionUseCase } from "../createReaction/CreateReactionUseCase";
import { DeleteReactionUseCase } from "./DeleteReactionUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let postRepositoryInMemory: PostRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let createPostUseCase: CreatePostUseCase;
let createReactionUseCase: CreateReactionUseCase;
let reactionRepository: IPostReactionRepository;
let deleteReaction: DeleteReactionUseCase;
let user1: User;
let user2: User;
let post: Post;
let reactionOne: PostReaction;
let reactionTwo: PostReaction;

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
    deleteReaction = new DeleteReactionUseCase(reactionRepository);
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
    createReactionUseCase = new CreateReactionUseCase(
      reactionRepository,
      postRepositoryInMemory
    );
    await createReactionUseCase.execute({
      postId: post.id,
      userId: user1.id,
      reactionType: ReactionTypeEnum.Like,
    });
    await createReactionUseCase.execute({
      postId: post.id,
      userId: user1.id,
      reactionType: ReactionTypeEnum.Dislike,
    });
    const reactions = await reactionRepository.getAll();
    reactionOne = reactions[0];
    reactionTwo = reactions[1];
  });

  it("should be able to delete a reaction type like", async () => {
    await deleteReaction.execute({
      postId: post.id,
      reactionType: ReactionTypeEnum.Like,
      userId: user1.id,
    });
    const reactions = await reactionRepository.getAll();
    expect(reactions.length).toBe(1);
  });
  it("should be able to delete a reaction type dislike", async () => {
    await deleteReaction.execute({
      postId: post.id,
      reactionType: ReactionTypeEnum.Dislike,
      userId: user1.id,
    });
    const reactions = await reactionRepository.getAll();
    expect(reactions.length).toBe(1);
  });

  it("should return error when try to delete a reaction that does not exists", async () => {
    await expect(
      deleteReaction.execute({
        postId: "wrong_id",
        reactionType: ReactionTypeEnum.Dislike,
        userId: user1.id,
      })
    ).rejects.toEqual(new AppError("Reaction not found", 404));
  });
});
