import { ICreateMessageInputDTO } from "@modules/users/dtos/ICreateMessageInputDTO";
import { IMessagesRepository } from "../IMessagesRepository";
import { MessagesEntity } from "@modules/users/entities/Messages";

class MessageRepositoryInMemory implements IMessagesRepository {
  private messages: MessagesEntity[] = [];
  async createMany(params: ICreateMessageInputDTO[]): Promise<void> {
    const messages = params.map((message) => {
      const newMessage = new MessagesEntity();
      Object.assign(newMessage, message);
      return newMessage;
    });
    messages.forEach((message) => {
      this.messages.push(message);
    });
  }
  async create(params: ICreateMessageInputDTO): Promise<MessagesEntity> {
    const message = new MessagesEntity();
    Object.assign(message, params);
    this.messages.push(message);
    return message;
  }
  async getAllFromUser(params: IGetAllMessagesDTO): Promise<MessagesEntity[]> {
    const userMessages = this.messages.filter((message) => {
      return (
        message.fromUserId === params.userId ||
        message.toUserId === params.userId
      );
    });

    const sortedByCreatedAtDesc = userMessages.sort((a, b) => {
      return b.created_at.getTime() - a.created_at.getTime();
    });
    const firstMessageOfRelationship = sortedByCreatedAtDesc.filter(
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

    return firstMessageOfRelationship;
  }
  async getMessagesBetweenUsers(
    params: getMessagesBetweenUsersDTO
  ): Promise<MessagesEntity[]> {
    const messagesBetweenUsers = this.messages.filter((message) => {
      return (
        (message.fromUserId === params.loggedUser &&
          message.toUserId === params.targetUser) ||
        (message.fromUserId === params.targetUser &&
          message.toUserId === params.loggedUser)
      );
    });
    const sortedValues = messagesBetweenUsers.sort((a, b) => {
      return b.created_at.getTime() - a.created_at.getTime();
    });
    const paginatedValues = sortedValues.slice(
      (params.page - 1) * params.limit,
      params.page * params.limit
    );
    return paginatedValues;
  }
}

export { MessageRepositoryInMemory };
