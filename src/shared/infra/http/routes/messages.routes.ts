import { CreateMessageController } from "@modules/users/useCases/createMessage/CreateMessageController";
import { GetAllConversationController } from "@modules/users/useCases/getAllConversations/GetAllConversationController";
import { GetConversationController } from "@modules/users/useCases/getConversation/GetConversationController";
import { Router } from "express";

export const messageRouter = Router();

const createMessageController = new CreateMessageController();

const getConversationController = new GetConversationController();

const getAllConversationsController = new GetAllConversationController();

messageRouter.post("/:id", createMessageController.handle);

messageRouter.get("/:id", getConversationController.handle);

messageRouter.get("/", getAllConversationsController.handle);
