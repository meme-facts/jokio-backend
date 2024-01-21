import { UserRepository } from "../../../modules/users/infra/prisma/repositories/UsersRepository";
import { IUserRepository } from "../../../modules/users/repositories/IUserRepository";
import { container } from "tsyringe";
import { FollowersRepository } from "@modules/users/infra/prisma/repositories/FollowersRepository";
import { IFollowersRepository } from "@modules/users/repositories/IFollowersRepository";
import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { PrismaMessagesRepository } from "@modules/users/infra/prisma/repositories/MessagesRepository";
import { EUserRepositories } from "./user.enum";

container.registerSingleton<IUserRepository>(
  EUserRepositories.UserRepository,
  UserRepository
);

container.registerSingleton<IFollowersRepository>(
  EUserRepositories.FollowersRepository,
  FollowersRepository
);

container.registerSingleton<IMessagesRepository>(
  EUserRepositories.MessagesRepository,
  PrismaMessagesRepository
);
