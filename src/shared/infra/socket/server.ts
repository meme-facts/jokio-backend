import { MessagesEntity } from "@modules/users/entities/Messages";
import { sendMessage } from "@modules/users/useCases/createMessage/CreateMessageGateway";
import http from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "./middlewares/ensureAuthenticated";

let io: Server;

export interface ICustomSocket extends Socket {
  user_id: string;
}

function initializeSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  verifyToken(io);
  io.removeAllListeners();

  io.on("connection", (socket: ICustomSocket) => {
    console.log("Socket connected -", socket.id + " @ " + socket.user_id);
    socket.join(socket.user_id);
    socket.on("message", (params: MessagesEntity) => {
      sendMessage(params);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected -", socket.id + " @ " + socket.user_id);
    });
    // ...
  });
}

export { initializeSocket, io };
