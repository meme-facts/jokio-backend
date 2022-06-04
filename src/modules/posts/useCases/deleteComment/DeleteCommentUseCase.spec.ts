import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { ICommentRepository } from "@modules/posts/repositories/ICommentRepository";
import { CommentRepositoryInMemory } from "@modules/posts/repositories/inMemory/CommentRepositoryInMemory";
import { PostRepositoryInMemory } from "@modules/posts/repositories/inMemory/PostRepositoryInMemory";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreatePostUseCase } from "../createPost/CreatePostUseCase";
import { CreateCommentUseCase } from "../createComment/CreateCommentUseCase";
import { DeleteCommentUseCase } from "./DeleteCommentUseCase";
import { Comments } from "@modules/posts/infra/typeorm/entities/Comment";

let commentaryRepositoryInMemory: ICommentRepository;
let userRepositoryInMemory: UserRepositoryInMemory;
let postRepositoryInMemory: PostRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let createPostUseCase: CreatePostUseCase;
let createCommentaryUseCase: CreateCommentUseCase;
let deleteCommentUseCase: DeleteCommentUseCase;
let user1: User;
let user2: User;
let user3: User;
let post: Post;
let commentaries: Comments[];
let commentId: string;
describe("DeleteCommentaryUseCase", () => {
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
    const thirdUserTest = await createUserUseCase.execute({
      full_name: "opateste2",
      nickname: "teste4",
      email: "silva4@teste.com",
      password: "1234",
    });
    user1 = firstUserTest.user;
    user2 = secondUserTest.user;
    user3 = thirdUserTest.user;
    post = await createPostUseCase.execute({
      postDescription: "olha ai um teste chegando",
      user_id: user1.id,
      img_url: "https://i.ytimg.com/vi/C_73egXn3bs/maxresdefault.jpg",
    });
    await createCommentaryUseCase.execute({
      userId: user2.id,
      message: "Olha um teste de comentário chegando",
      postId: post.id,
    });
    deleteCommentUseCase = new DeleteCommentUseCase(
      commentaryRepositoryInMemory,
      postRepositoryInMemory
    );
    const commentary = await commentaryRepositoryInMemory.getAll();
    commentId = commentary[0].id;
  });

  it("should delete a comment", async () => {
    console.log;
    await deleteCommentUseCase.execute(commentId, user1.id);
    expect(commentaries.length).toBe(0);
  });

  //   it("should not be able to create a comment on a non existent comment", async () => {
  //     await expect(
  //       deleteCommentUseCase.execute("wrong_id", user1.id)
  //     ).rejects.toEqual(new AppError("This comment does not exist", 404));
  //   });

  //   it("should not be able to create a comment on a non existent comment", async () => {
  //     await expect(
  //       deleteCommentUseCase.execute(commentId, user3.id)
  //     ).rejects.toEqual(
  //       new AppError("Comment can only be deleted by owner or by post owner", 401)
  //     );
  //   });
});
