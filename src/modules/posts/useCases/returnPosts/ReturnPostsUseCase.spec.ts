import { ReactionTypeEnum } from "@modules/posts/enums/ReactionTypeEnum";
import { PostReactionsRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostReactionsRepositoryInMemory";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { IPostReactionRepository } from "@modules/posts/repositories/IPostReactionRepository";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";
import { ReturnPostsUseCase } from "./ReturnPostsUseCase";

interface ITestPostRepository extends IPostRepository {
  insertReaction(
    postId: string,
    userId: string,
    reactionType: string
  ): Promise<void>;
}

let postRepositoryInMemory: ITestPostRepository;
let userRepositoryInMemory: IUserRepository;
let createPostUseCase: CreatePostUseCase;
let createUserUseCase: CreateUserUseCase;
let returnPostUseCase: ReturnPostsUseCase;
let user;
let user2;
let user3;
let user4;

describe("CreatePostUseCase", () => {
  beforeEach(async () => {
    postRepositoryInMemory = new PostRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

    createPostUseCase = new CreatePostUseCase(
      postRepositoryInMemory,
      userRepositoryInMemory
    );
    returnPostUseCase = new ReturnPostsUseCase(
      postRepositoryInMemory,
      userRepositoryInMemory
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
    const interestingPost = await createPostUseCase.execute({
      postDescription: "post maneiro",
      user_id: user.user.id,
      img_url: "https://i.ytimg.com/vi/C_73egXn3bs/maxresdefault.jpg",
    });
    postRepositoryInMemory.insertReaction(
      interestingPost.id,
      user2.id,
      ReactionTypeEnum.Like
    );
    postRepositoryInMemory.insertReaction(
      interestingPost.id,
      user3.id,
      ReactionTypeEnum.Like
    );
    postRepositoryInMemory.insertReaction(
      interestingPost.id,
      user4.id,
      ReactionTypeEnum.Like
    );
    for (let i = 0; i < 14; i++) {
      await createPostUseCase.execute({
        postDescription: `olha ai um teste chegando ${i + 1}`,
        user_id: user.user.id,
        img_url: "https://i.ytimg.com/vi/C_73egXn3bs/maxresdefault.jpg",
      });
    }
  });

  it("it should be able to return posts", async () => {
    const posts = await returnPostUseCase.execute({
      page: 1,
      limit: 10,
    });
    expect(posts[0]).toHaveProperty("id");
  });
  it("it should return 10 posts without skips pages when pagesize = 10 and page = 1", async () => {
    const posts = await returnPostUseCase.execute({
      page: 1,
      limit: 10,
    });
    expect(posts[9].postDescription).toEqual("olha ai um teste chegando 10");
    expect(posts.length).toBe(10);
  });
  it("it should return 4 posts skipping 10 itens pages when pagesize = 10 and page = 2", async () => {
    const posts = await returnPostUseCase.execute({
      page: 2,
      limit: 10,
    });
    expect(posts[0].postDescription).toEqual("olha ai um teste chegando 11");
    expect(posts[3].postDescription).toEqual("olha ai um teste chegando 14");
    expect(posts.length).toBe(4);
  });
  //
  //
  //it should return reactions quantity per post
});
