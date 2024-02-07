import { verify } from "jsonwebtoken";
import { AppError } from "@shared/errors/AppError";
import { Server, Socket } from "socket.io";
import { UserRepository } from "@modules/users/infra/prisma/repositories/UsersRepository";
import { ICustomSocket } from "../server";

interface IPayload {
  sub: string;
}

export function verifyToken(ioInstance: Server) {
  ioInstance.use((socket: ICustomSocket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const userRepository = new UserRepository();
      const tokenverify = verify(token, process.env.JWT_SECRET) as IPayload;
      const { sub: user_id } = tokenverify;
      const user = userRepository.getById(user_id);
      if (!user) {
        return next(new AppError("User do not exist", 401));
        //throw new AppError("User do not exist", 401);
      }
      socket.user_id = user_id;
      return next();
    } catch {
      return next(new AppError("Invalid token", 401));
      //throw new AppError("Invalid token", 401);
    }
  });
}
