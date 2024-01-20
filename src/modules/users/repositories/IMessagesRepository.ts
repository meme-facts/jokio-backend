import { ICreateMessageInputDTO } from "../dtos/ICreateMessageInputDTO";
import { MessagesEntity } from "../entities/Messages";

interface IMessagesRepository {
  create(params: ICreateMessageInputDTO): Promise<MessagesEntity>;
  createMany(params: ICreateMessageInputDTO[]): Promise<void>;
  getAllFromUser(params: IGetAllMessagesDTO): Promise<MessagesEntity[]>;
  getMessagesBetweenUsers(
    params: getMessagesBetweenUsersDTO
  ): Promise<MessagesEntity[]>;
}
export { IMessagesRepository };
