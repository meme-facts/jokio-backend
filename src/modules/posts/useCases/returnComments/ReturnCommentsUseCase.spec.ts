import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { CommentRepositoryInMemory } from "@modules/posts/repositories/inMemory/CommentRepositoryInMemory";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateCommentUseCase } from "../createComment/CreateCommentUseCase";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";
import { ReturnCommentsUseCase } from "./ReturnCommentsUseCase";
import { UserEntity } from "@modules/users/entities/User";
import { PostEntity } from "@modules/posts/entities/Post";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

let commentsRepository: ICommentRepository;
let userRepositoryInMemory: IUserRepository;
let postRepository: IPostRepository;
let returnComments: ReturnCommentsUseCase;
let createUserUseCase: CreateUserUseCase;
let createPostUseCase: CreatePostUseCase;
let createCommentUseCase: CreateCommentUseCase;
let user1: UserEntity;
let user2: UserEntity;
let post: PostEntity;

describe("Return Comments UseCase", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    commentsRepository = new CommentRepositoryInMemory();
    postRepository = new PostRepositoryInMemory();
    returnComments = new ReturnCommentsUseCase(
      commentsRepository,
      postRepository
    );
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    createPostUseCase = new CreatePostUseCase(
      postRepository,
      userRepositoryInMemory
    );
    createCommentUseCase = new CreateCommentUseCase(
      commentsRepository,
      postRepository
    );
    const firstUserTest = await createUserUseCase.execute({
      full_name: "opateste",
      nickname: "testelegal",
      email: "silvaxabla@teste.com",
      password: "1234",
    });
    const secondUserTest = await createUserUseCase.execute({
      full_name: "opateste2",
      nickname: "testelegal2",
      email: "asilvaxabla2@teste.com",
      password: "1234",
    });
    user1 = firstUserTest.user;
    user2 = secondUserTest.user;
    post = await createPostUseCase.execute({
      postDescription: "olha ai um teste chegando",
      user_id: user1.id,
      img_url: "https://i.ytimg.com/vi/C_73egXn3bs/maxresdefault.jpg",
    });
    for (let i = 0; i < 15; i++) {
      await createCommentUseCase.execute({
        userId: user1.id,
        postId: post.id,
        message: `AAAAAAAAAAAAAAAAAAAAAAA${i + 1}`,
      });
    }
  });
  it("should return comments", async () => {
    const { comments } = await returnComments.execute({
      page: 1,
      limit: 5,
      postId: post.id,
    });
    expect(comments[0]).toHaveProperty("id");
  });
  it("should not be able to return comments when post does not exist", async () => {
    await expect(
      createCommentUseCase.execute({
        userId: user1.id,
        postId: "wrong_id",
        message: `AAAAAAAAAAAAAAAAAAAAAAA`,
      })
    ).rejects.toEqual(new AppError("This post does not exist", 404));
  });
  it("should return comments bring just 5 comments when limit is 5 and count is more than this", async () => {
    const { comments, count } = await returnComments.execute({
      page: 1,
      limit: 5,
      postId: post.id,
    });
    expect(comments).toHaveLength(5);
    expect(count).toBeGreaterThan(5);
  });
  it("should jump 5 comments when limit is 5 and page is 2", async () => {
    const { comments, count } = await returnComments.execute({
      page: 2,
      limit: 5,
      postId: post.id,
    });
    expect(comments).toHaveLength(5);
    expect(count).toBeGreaterThan(5);
    expect(comments[0].message).toEqual("AAAAAAAAAAAAAAAAAAAAAAA6");
  });
});
