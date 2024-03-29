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
      include: {
        fromUser: true,
        toUser: true,
      },
    });
  }
  async getAllFromUser({
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
      include: {
        fromUser: true,
        toUser: true,
      },
      orderBy: {
        created_at: "desc",
      },
      distinct: ["fromUserId", "toUserId"],
    });
    const filterDuplicates = lastMessagesBetweenUsers.filter(
      (value, index, self) => {
        return (
          index ===
          self.findIndex(
            (item) =>
              (item.fromUserId === value.fromUserId &&
                item.toUserId === value.toUserId) ||
              (item.fromUserId === value.toUserId &&
                item.toUserId === value.fromUserId)
          )
        );
      }
    );
    return filterDuplicates;
  }

  async getMessagesBetweenUsers(
    params: getMessagesBetweenUsersDTO
  ): Promise<{ count: number; messagesBetweenUsers: MessagesEntity[] }> {
    const [count, messagesBetweenUsers] = await Promise.all([
      this.repository.count({
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
      }),
      this.repository.findMany({
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
        skip: params.offset,
        take: params.limit,
      }),
    ]);

    return {
      count,
      messagesBetweenUsers,
    };
  }
}

export { PrismaMessagesRepository };
