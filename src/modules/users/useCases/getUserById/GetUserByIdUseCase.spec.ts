import { Post } from "@modules/posts/infra/typeorm/entities/Post";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { UserRepository } from "@modules/users/infra/typeorm/repositories/UsersRepository";
import { UserRepositoryInMemory } from "@modules/users/repositories/InMemory/UserRepositoryInMemory";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { GetAllUsersUseCase } from "../getAllUsers/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "./GetUserByIdUseCase";

let userRepository: IUserRepository;
let createUserUseCase: CreateUserUseCase;
let getAllUsersByIdUseCase: GetUserByIdUseCase;
let user: User;
describe("GetAllUsersByIdUseCase", () => {
  beforeEach(async () => {
    // userRepository = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);

    const createdUser = await createUserUseCase.execute({
      full_name: "opateste",
      nickname: "teste2",
      email: "silva@teste.com",
      password: "1234",
    });
    user = createdUser.user;
    const post = new Post();

    Object.assign(post, {
      postDescription: "teste123",
      img_url: "img_url_test",
      user_id: user.id,
    });

    getAllUsersByIdUseCase = new GetUserByIdUseCase(userRepository);
  });

  it("should return a user with their posts", async () => {
    const returnedUser = await getAllUsersByIdUseCase.execute({
      loggedUserId: "1",
      requestUserId: user.id,
    });
    console.log(returnedUser);
  });
});
