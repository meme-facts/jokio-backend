import { UserRepository } from "../../modules/users/infra/typeorm/repositories/UsersRepository";
import { IUserRepository } from "../../modules/users/repositories/IUserRepository";
import { container } from "tsyringe";

container.registerSingleton<IUserRepository>("UserRepository", UserRepository);
