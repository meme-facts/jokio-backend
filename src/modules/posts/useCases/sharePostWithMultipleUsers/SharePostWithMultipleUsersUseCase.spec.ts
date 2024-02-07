import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ReturnPostsUseCase } from "../returnPosts/ReturnPostsUseCase";
import { IPostLikeRepository } from "@modules/posts/repositories/IPostLikeRepository";
import { IPostDislikeRepository } from "@modules/posts/repositories/IPostDislikeRepository";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { PostReactionsRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostReactionsRepositoryInMemory";
import { PostDislikeRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostDislikeRepositoryInMemory";
import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";
import { SharePostWithMultipleUsersUseCase } from "./SharePostWithMultipleUsersUseCase";
import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { MessageRepositoryInMemory } from "@modules/users/repositories/InMemory/MessageRepositoryInMemory";
import { GetConversationUseCase } from "@modules/users/useCases/getConversation/GetConversationUseCase";

let postRepositoryInMemory: IPostRepository;
let userRepositoryInMemory: IUserRepository;
let messagesRepository: IMessagesRepository;
let createPostUseCase: CreatePostUseCase;
let createUserUseCase: CreateUserUseCase;
let returnPostUseCase: ReturnPostsUseCase;
let likeRepository: IPostLikeRepository;
let dislikeRepository: IPostDislikeRepository;
let getConversationUseCase: GetConversationUseCase;
let sharePostWithMultipleUsersUseCase: SharePostWithMultipleUsersUseCase;
let user: UserDto;
let user2: UserDto;
let user3: UserDto;

describe("SharePostWithMultipleUsersUseCase", () => {
  beforeEach(async () => {
    postRepositoryInMemory = new PostRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    likeRepository = new PostReactionsRepositoryInMemory();
    dislikeRepository = new PostDislikeRepositoryInMemory();
    messagesRepository = new MessageRepositoryInMemory();
    sharePostWithMultipleUsersUseCase = new SharePostWithMultipleUsersUseCase(
      postRepositoryInMemory,
      userRepositoryInMemory,
      messagesRepository
    );
    getConversationUseCase = new GetConversationUseCase(
      userRepositoryInMemory,
      messagesRepository
    );
    createPostUseCase = new CreatePostUseCase(
      postRepositoryInMemory,
      userRepositoryInMemory
    );
    returnPostUseCase = new ReturnPostsUseCase(
      postRepositoryInMemory,
      likeRepository,
      dislikeRepository
    );
    user = (
      await createUserUseCase.execute({
        full_name: "opateste",
        nickname: "teste2",
        email: "test@testttt.com",
        password: "12345678",
      })
    ).user;
    user2 = (
      await createUserUseCase.execute({
        full_name: "opateste1",
        nickname: "teste1",
        email: "123123@123123.com",
        password: "123123123",
      })
    ).user;
    user3 = (
      await createUserUseCase.execute({
        full_name: "opateste6",
        nickname: "teste5",
        email: "123@123.com",
        password: "123123123",
      })
    ).user;
  });
  it("should be able to share a post with multiple users", async () => {
    const post = await createPostUseCase.execute({
      user_id: user.id,
      postDescription: "teste",
      img_url: "https://teste.com",
    });

    await sharePostWithMultipleUsersUseCase.execute({
      postId: post.id,
      fromUserId: user.id,
      usersIds: [user2.id, user3.id],
    });

    const conversation1 = await getConversationUseCase.execute({
      loggedUserId: user.id,
      targetUserId: user2.id,
      page: 1,
      limit: 10,
    });
    const conversation2 = await getConversationUseCase.execute({
      loggedUserId: user.id,
      targetUserId: user3.id,
      page: 1,
      limit: 10,
    });

    expect(conversation1.messagesBetweenUsers.length).toBe(1);
    expect(conversation1.count).toBe(1);
    expect(conversation2.messagesBetweenUsers.length).toBe(1);
    expect(conversation2.count).toBe(1);
  });
  it("should not be able to share a post with multiple users if the post does not exist", async () => {
    await expect(
      sharePostWithMultipleUsersUseCase.execute({
        postId: "wrongId",
        fromUserId: user.id,
        usersIds: [user2.id, user3.id],
      })
    ).rejects.toThrow("Post not found");
  });
  it("should not be able to share a post with multiple users if logged user does not exist", async () => {
    const post = await createPostUseCase.execute({
      user_id: user.id,
      postDescription: "teste",
      img_url: "https://teste.com",
    });

    await expect(
      sharePostWithMultipleUsersUseCase.execute({
        postId: post.id,
        fromUserId: "wrongId",
        usersIds: [user2.id, user3.id],
      })
    ).rejects.toThrow("Sender not found");
  });
  it("should not be able to share a post with multiple users if some of the users does not exist", async () => {
    const post = await createPostUseCase.execute({
      user_id: user.id,
      postDescription: "teste",
      img_url: "https://teste.com",
    });

    await expect(
      sharePostWithMultipleUsersUseCase.execute({
        postId: post.id,
        fromUserId: user.id,
        usersIds: ["wrongId", user3.id],
      })
    ).rejects.toThrow("One or more receivers not found");
  });
  it("should not be able to share a post with multiple users if the logged user is trying to share with himself", async () => {
    const post = await createPostUseCase.execute({
      user_id: user.id,
      postDescription: "teste",
      img_url: "https://teste.com",
    });

    await expect(
      sharePostWithMultipleUsersUseCase.execute({
        postId: post.id,
        fromUserId: user.id,
        usersIds: [user.id, user3.id],
      })
    ).rejects.toThrow("You can't share a post with yourself");
  });
});
