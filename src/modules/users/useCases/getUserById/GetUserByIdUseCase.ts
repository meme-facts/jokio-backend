import { IGetUserByIdDTO } from "@modules/users/dtos/IGetUserByIdDTO";
import { User } from "@modules/users/infra/typeorm/entities/Users";
import { IUserRepository } from "@modules/users/repositories/IUserRepository";
import { StatusEnum } from "@shared/enums/StatusEnum";
import { inject, injectable } from "tsyringe";

interface IUserResponse extends User {
  relationStatus?: StatusEnum;
}

@injectable()
class GetUserByIdUseCase {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}
  async execute({
    loggedUserId,
    requestUserId,
  }: IGetUserByIdDTO): Promise<IUserResponse> {
    const user = await this.userRepository.getAllById(requestUserId);
    return user;
  }
}

export { GetUserByIdUseCase };
