import { PostEntity } from "@modules/posts/entities/Post";
import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { IPostRepository } from "@modules/posts/repositories/IPostRepository";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { FollowersRepositoryInMemory } from "@modules/users/repositories/InMemory/FollowersRepositoryInMemort";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { RequestUserToFollowUseCase } from "@modules/users/useCases/requestUserToFollow/RequestUserToFollowUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";
import { ReturnPostByUserNicknameUseCase } from "./ReturnPostByUserNicknameUseCase";

describe("ReturnPostByUserNickNameUseCase", () => {
  const postCount = 20;
  let postRepository: IPostRepository;
  let userRepository: IUserRepository;
  let followerRepository: IFollowersRepository;
  let returnPostByUserNicknameUseCase: ReturnPostByUserNicknameUseCase;
  let createUserUseCase: CreateUserUseCase;
  let createPostUseCase: CreatePostUseCase;
  let requestUserToFollowUseCase: RequestUserToFollowUseCase;
  let user: UserDto;
  let user2: UserDto;
  let posts: PostEntity[];
  beforeEach(async () => {
    postRepository = new PostRepositoryInMemory();
    userRepository = new UserRepositoryInMemory();
    followerRepository = new FollowersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);
    createPostUseCase = new CreatePostUseCase(postRepository, userRepository);
    returnPostByUserNicknameUseCase = new ReturnPostByUserNicknameUseCase(
      postRepository,
      followerRepository,
      userRepository
    );
    requestUserToFollowUseCase = new RequestUserToFollowUseCase(
      followerRepository,
      userRepository
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
    posts = await Promise.all(
      Array.from({ length: postCount }).map((_, i) => {
        const post = postRepository.create({
          postDescription: `post description ${i + 1}`,
          user_id: user.id,
        });

        return post;
      })
    );
  });
  it("should return post by user with count = totalCount and length = limit", async () => {
    const limit = 10;

    const result = await returnPostByUserNicknameUseCase.execute({
      page: 1,
      limit,
      logged_user_id: user.id,
      userName: user.nickname,
    });
    expect(result.count).toBe(postCount);
    expect(result.posts.length).toBe(limit);
  });
  it("should skip limit when page = 2", async () => {
    const limit = 10;
    const target = posts[limit];

    const result = await returnPostByUserNicknameUseCase.execute({
      page: 2,
      limit,
      logged_user_id: user.id,
      userName: user.nickname,
    });
    expect(result.count).toBe(postCount);
    expect(result.posts[0]).toEqual(target);
  });

  it("should return post by user and return relation status = O when logged user = target user", async () => {
    const limit = 10;

    const result = await returnPostByUserNicknameUseCase.execute({
      page: 1,
      limit,
      logged_user_id: user.id,
      userName: user.nickname,
    });
    expect(result.relationStatus).toBe(FollowerStatusEnum.OWNER);
    expect(result.count).toBe(postCount);
    expect(result.posts.length).toBe(limit);
  });

  it("should return post by user and return relation status = U when logged user != target user and they do not have a relation", async () => {
    const limit = 10;

    const result = await returnPostByUserNicknameUseCase.execute({
      page: 1,
      limit,
      logged_user_id: user2.id,
      userName: user.nickname,
    });
    expect(result.relationStatus).toBe(FollowerStatusEnum.UNKNOWN);
    expect(result.count).toBe(postCount);
    expect(result.posts.length).toBe(limit);
  });
  it("should return post by user and return relation status = U when logged user != target user and they do not have a relation", async () => {
    const limit = 10;
    await requestUserToFollowUseCase.execute({
      requestedUserId: user.id,
      requesterUserId: user2.id,
    });

    const result = await returnPostByUserNicknameUseCase.execute({
      page: 1,
      limit,
      logged_user_id: user2.id,
      userName: user.nickname,
    });
    expect(result.relationStatus).toBe(FollowerStatusEnum.Accepted);
    expect(result.count).toBe(postCount);
    expect(result.posts.length).toBe(limit);
  });
  it("should return post by user and return relation status = U when logged user != target user and they do not have a relation", async () => {
    expect(async () => {
      await returnPostByUserNicknameUseCase.execute({
        page: 1,
        limit: 10,
        logged_user_id: user.id,
        userName: "wrong_username",
      });
    }).rejects.toThrow(new AppError("This user does not exist", 404));
  });
});
