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

let commentsRepository: ICommentRepository;
let userRepository: IUserRepository;
let postRepository: IPostRepository;
let returnComments: ReturnCommentsUseCase;
let createUserUseCase: CreateUserUseCase;
let createPostUseCase: CreatePostUseCase;
let createCommentUseCase: CreateCommentUseCase;
let user1: User;
let user2: User;
let post: Post;

describe("Return Comments UseCase", () => {
  beforeEach(async () => {
    commentsRepository = new CommentRepositoryInMemory();
    postRepository = new PostRepositoryInMemory();
    returnComments = new ReturnCommentsUseCase(
      commentsRepository,
      postRepository
    );
    createUserUseCase = new CreateUserUseCase(userRepository);
    createPostUseCase = new CreatePostUseCase(postRepository, userRepository);
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
      email: "silvaxabla2@teste.com",
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
    const comments = await returnComments.execute({
      page: 1,
      limit: 5,
      postId: post.id,
    });
    expect(comments.comments[0]).toHaveProperty("id");
  });
  // should not be able to return comments when post does not exist
  // should return comments bring just 5 comments when limit is 5
  // should jump 5 comments when limit is 5 and page is 2
});
