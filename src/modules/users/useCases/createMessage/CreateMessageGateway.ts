import { ICustomSocket, io } from "@shared/infra/socket/server";
import { container } from "tsyringe";
import { CreateMessageUseCase } from "./CreateMessageUserCase";
import { MessagesEntity } from "@modules/users/entities/Messages";

const sendMessage = async ({
  id,
  toUserId,
  created_at,
  fromUserId,
  message,
  isRead,
}: MessagesEntity) => {
  const createMessageUseCase = container.resolve(CreateMessageUseCase);

  const response = await createMessageUseCase.execute({
    id,
    fromUserId,
    toUserId,
    message,
    created_at,
  });
  console.log(response, "opaaa");

  io.to(toUserId).emit("private_message", response);
};

export { sendMessage };
