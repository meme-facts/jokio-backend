import { PostEntity } from "@modules/posts/entities/Post";
import { ReactionTypeEnum } from "@modules/posts/enums/ReactionTypeEnum";
import { IPostLikeRepository } from "@modules/posts/repositories/IPostLikeRepository";
import { PostReactionsRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostReactionsRepositoryInMemory";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { UserEntity } from "@modules/users/entities/User";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateLikeUseCase } from "../createLike/CreateReactionUseCase";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let postRepositoryInMemory: PostRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let createPostUseCase: CreatePostUseCase;
let createReactionUseCase: CreateLikeUseCase;
let reactionRepository: IPostLikeRepository;
let user1: UserEntity;
let user2: UserEntity;
let post: PostEntity;

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
  });
  it("should add a reaction type L(Like)", async () => {
    await createReactionUseCase.execute({
      postId: post.id,
      userId: user1.id,
    });
    const postReaction = await reactionRepository.getAll();
    expect(postReaction[0]).toHaveProperty("id");
    expect(postReaction[0]).toHaveProperty("postId");
    expect(postReaction[0]).toHaveProperty("userId");
  });

  it("should increment like count on posts when like it", async () => {
    const postCount = post.likeCount;
    await createReactionUseCase.execute({
      postId: post.id,
      userId: user1.id,
    });
    expect(post.likeCount).toEqual(postCount + 1);
  });

  it("it should not be able to add a reaction when post do not exist", async () => {
    await expect(
      createReactionUseCase.execute({
        postId: "wrong_post_id",
        userId: user1.id,
      })
    ).rejects.toEqual(new AppError("This post does not exist", 404));
  });
});
