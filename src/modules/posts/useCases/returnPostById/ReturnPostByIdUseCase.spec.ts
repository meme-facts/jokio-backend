import { IPostDislikeRepository } from "@modules/posts/repositories/IPostDislikeRepository";
import { IPostLikeRepository } from "@modules/posts/repositories/IPostLikeRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { PostDislikeRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostDislikeRepositoryInMemory";
import { PostReactionsRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostReactionsRepositoryInMemory";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";
import { ReturnPostByIdUseCase } from "./ReturnPostByIdUseCase";
import { randomUUID } from "crypto";

let postRepositoryInMemory: IPostRepository;
let userRepositoryInMemory: IUserRepository;
let createPostUseCase: CreatePostUseCase;
let createUserUseCase: CreateUserUseCase;
let likeRepository: IPostLikeRepository;
let dislikeRepository: IPostDislikeRepository;
let returnPosByIdUseCase: ReturnPostByIdUseCase;
let user;
let user2;
let user3;
let user4;
let randomId;

describe("ReturnPostUseCase", () => {
  beforeEach(async () => {
    randomId = randomUUID();
    postRepositoryInMemory = new PostRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    likeRepository = new PostReactionsRepositoryInMemory();
    dislikeRepository = new PostDislikeRepositoryInMemory();
    createPostUseCase = new CreatePostUseCase(
      postRepositoryInMemory,
      userRepositoryInMemory
    );
    returnPosByIdUseCase = new ReturnPostByIdUseCase(
      postRepositoryInMemory,
      likeRepository,
      dislikeRepository
    );
    user = await createUserUseCase.execute({
      full_name: "opateste",
      nickname: "teste2",
      email: "silva@teste.com",
      password: "1234",
    });
    user2 = await createUserUseCase.execute({
      full_name: "opateste1",
      nickname: "teste1",
      email: "silva1@teste.com",
      password: "1234",
    });
    user3 = await createUserUseCase.execute({
      full_name: "opateste6",
      nickname: "teste5",
      email: "silva12@teste.com",
      password: "1234",
    });
    user4 = await createUserUseCase.execute({
      full_name: "opateste21",
      nickname: "teste21",
      email: "2silva1@teste.com",
      password: "1234",
    });
    console.log(user);
    await createPostUseCase.execute({
      id: randomId,
      postDescription: `olha ai um teste chegando`,
      user_id: user.user.id,
      img_url: "https://i.ytimg.com/vi/C_73egXn3bs/maxresdefault.jpg",
    });
  });

  it("should return an error when post do not exist", async () => {
    await expect(
      returnPosByIdUseCase.execute({
        loggedUserId: user.id,
        postId: "wrong_id",
      })
    ).rejects.toEqual(new AppError("Post not found.", 404));
  });
  it("should return a single post", async () => {
    const post = await returnPosByIdUseCase.execute({
      loggedUserId: user.user.id,
      postId: randomId,
    });
    console.log(user.user.id);
    expect(post).toHaveProperty("id");
    expect(post.id).toEqual(randomId);
  });
  it("should return if logged user already liked and disliked the post", async () => {
    const post = await returnPosByIdUseCase.execute({
      loggedUserId: user.user.id,
      postId: randomId,
    });
    expect(post).toHaveProperty("likedByLoggedUser");
    expect(post).toHaveProperty("dislikedByLoggedUser");
  });
});
