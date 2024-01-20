import "reflect-metadata";
import request from "supertest";
import { app } from "../http/app";
import { resetDb } from "./helpers/reset-db";

export interface IUserForTest {
  full_name: string;
  nickname: string;
  email: string;
  password: string;
  token?: string;
  id?: string;
}

export const user: IUserForTest = {
  full_name: "John Doe",
  nickname: "john_doe",
  email: "test@test.com",
  password: "12345678",
};
export let token: string;
beforeEach(async () => {
  await resetDb();
  const response = await request(app).post("/users").send(user);
  Object.assign(user, {
    token: response.body.token,
    id: response.body.id,
  });
});
afterAll(async () => {
  await resetDb();
});
