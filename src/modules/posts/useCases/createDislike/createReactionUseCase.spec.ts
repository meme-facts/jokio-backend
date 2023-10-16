import { ReactionTypeEnum } from "@modules/posts/enums/ReactionTypeEnum";
import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { CommentRepositoryInMemory } from "@modules/posts/repositories/inMemory/CommentRepositoryInMemory";
import { PostReactionsRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostReactionsRepositoryInMemory";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { IPostReactionRepository } from "@modules/posts/repositories/IPostDislikeRepository";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateCommentUseCase } from "../createComment/CreateCommentUseCase";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";
import { CreateReactionUseCase } from "./CreateReactionUseCase";

let userRepositoryInMemory: UserRepositoryInMemory;
let postRepositoryInMemory: PostRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let createPostUseCase: CreatePostUseCase;
let createReactionUseCase: CreateReactionUseCase;
let reactionRepository: IPostReactionRepository;
let user1: User;
let user2: User;
let post: Post;

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
    createReactionUseCase = new CreateReactionUseCase(
      reactionRepository,
      postRepositoryInMemory
    );
  });
  it("should add a reaction type L(Like)", async () => {
    await createReactionUseCase.execute({
      postId: post.id,
      userId: user1.id,
      reactionType: ReactionTypeEnum.Like,
    });
    const postReaction = await reactionRepository.getAll();
    expect(postReaction[0].reactionType).toEqual(ReactionTypeEnum.Like);
  });

  it("it should add a reaction type D(Dislike)", async () => {
    await createReactionUseCase.execute({
      postId: post.id,
      userId: user1.id,
      reactionType: ReactionTypeEnum.Dislike,
    });
    const postReaction = await reactionRepository.getAll();
    expect(postReaction[0].reactionType).toEqual(ReactionTypeEnum.Dislike);
  });

  it("it should not be able to add a reaction when post do not exist", async () => {
    await expect(
      createReactionUseCase.execute({
        postId: "wrong_post_id",
        userId: user1.id,
        reactionType: ReactionTypeEnum.Dislike,
      })
    ).rejects.toEqual(new AppError("This post does not exist", 404));
  });
});
