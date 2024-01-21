import { ICreateMessageInputDTO } from "@modules/users/dtos/ICreateMessageInputDTO";
import { MessagesEntity } from "@modules/users/entities/Messages";
import { IMessagesRepository } from "@modules/users/repositories/IMessagesRepository";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

class PrismaMessagesRepository implements IMessagesRepository {
  private repository: Prisma.MessagesDelegate<DefaultArgs>;
  constructor() {
    this.repository = new PrismaClient().messages;
  }

  async createMany(params: ICreateMessageInputDTO[]): Promise<void> {
    await this.repository.createMany({
      data: params,
    });
  }
  async create(params: ICreateMessageInputDTO): Promise<MessagesEntity> {
    return this.repository.create({
      data: params,
    });
  }
  async getAllFromUser({
    page,
    limit,
    userId,
  }: IGetAllMessagesDTO): Promise<MessagesEntity[]> {
    const lastMessagesBetweenUsers = await this.repository.findMany({
      where: {
        OR: [
          {
            fromUserId: userId,
          },
          {
            toUserId: userId,
          },
        ],
      },
      orderBy: {
        created_at: "desc",
      },
      distinct: ["fromUserId", "toUserId"],
      skip: (page - 1) * limit,
      take: limit,
    });
    const filterDuplicates = lastMessagesBetweenUsers.filter(
      (value, index, self) => {
        return (
          index ===
          self.findIndex(
            (item) =>
              item.fromUserId === value.fromUserId ||
              item.toUserId === value.toUserId
          )
        );
      }
    );
    return filterDuplicates;
  }

  async getMessagesBetweenUsers(
    params: getMessagesBetweenUsersDTO
  ): Promise<MessagesEntity[]> {
    const messagesBetweenUsers = await this.repository.findMany({
      where: {
        OR: [
          {
            fromUserId: params.loggedUser,
            toUserId: params.targetUser,
          },
          {
            fromUserId: params.targetUser,
            toUserId: params.loggedUser,
          },
        ],
      },
      orderBy: {
        created_at: "desc",
      },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
    });
    return messagesBetweenUsers;
  }
}

export { PrismaMessagesRepository };
