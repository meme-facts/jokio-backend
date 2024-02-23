import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { CommentRepositoryInMemory } from "@modules/posts/repositories/inMemory/CommentRepositoryInMemory";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";
import { CreateCommentUseCase } from "./CreateCommentUseCase";
import { UserEntity } from "@modules/users/entities/User";
import { PostEntity } from "@modules/posts/entities/Post";

let commentaryRepositoryInMemory: ICommentRepository;
let userRepositoryInMemory: UserRepositoryInMemory;
let postRepositoryInMemory: PostRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let createPostUseCase: CreatePostUseCase;
let createCommentaryUseCase: CreateCommentUseCase;
let user1: UserEntity;
let user2: UserEntity;
let post: PostEntity;

describe("CreateCommentaryUseCase", () => {
  beforeEach(async () => {
    commentaryRepositoryInMemory = new CommentRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    postRepositoryInMemory = new PostRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    createPostUseCase = new CreatePostUseCase(
      postRepositoryInMemory,
      userRepositoryInMemory
    );
    createCommentaryUseCase = new CreateCommentUseCase(
      commentaryRepositoryInMemory,
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
  });

  it("should add a commentary", async () => {
    await createCommentaryUseCase.execute({
      userId: user2.id,
      message: "Olha um teste de comentário chegando",
      postId: post.id,
    });
    const commentary = await commentaryRepositoryInMemory.getAll();
    expect(commentary[0].message).toEqual(
      "Olha um teste de comentário chegando"
    );
  });

  it("should not be able to add a commentary on a non existent post", async () => {
    await expect(
      createCommentaryUseCase.execute({
        userId: user2.id,
        message: "Olha um teste de comentário chegando",
        postId: "wrong_post_id",
      })
    ).rejects.toEqual(new AppError("This post does not exist"));
  });
});
