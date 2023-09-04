import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserRepository } from "@modules/users/infra/prisma/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeaders = request.headers.authorization;

  if (!authHeaders) {
    throw new AppError("Needs token", 401);
  }
  const [, token] = authHeaders.split(" ");
  try {
    const userRepository = new UserRepository();
    const tokenverify = verify(token, process.env.JWT_SECRET) as IPayload;
    const { sub: user_id } = tokenverify;
    const user = userRepository.getById(user_id);
    if (!user) {
      throw new AppError("User do not exist", 401);
    }
    request.user = {
      id: user_id,
    };
    return next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
}
