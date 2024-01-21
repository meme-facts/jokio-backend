import { app } from "@shared/infra/http/app";
import { IUserForTest, user } from "@shared/infra/jest/jest.setup";
import { randomUUID } from "crypto";
import request from "supertest";

describe("CreateMessageController", () => {
  const user2: IUserForTest = {
    full_name: "John Doe",
    nickname: "john_doe2",
    email: "jon2@you.com",
    password: "123345678",
  };
  beforeEach(async () => {
    const { body } = await request(app).post("/users").send(user2);
    Object.assign(user2, {
      id: body.id,
      token: body.token,
    });
  });
  it("should be able to create a new message", async () => {
    const response = await request(app)
      .post(`/messages/${user2.id}`)
      .send({
        message: "teste",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    expect(response.status).toBe(201);
  });
  it("should not be able to create a new message if user is not authenticated", async () => {
    const response = await request(app).post(`/messages/${user2.id}`).send({
      message: "teste",
    });
    expect(response.status).toBe(401);
  });
  it("should not be able to create a new message if user not exists", async () => {
    const response = await request(app)
      .post(`/messages/${randomUUID()}`)
      .send({
        message: "teste",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    expect(response.status).toBe(404);
  });
  it("should not be able to create a new message if message is empty", async () => {
    const response = await request(app)
      .post(`/messages/${user2.id}`)
      .send({
        message: "",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    expect(response.status).toBe(400);
  });
  it("should return validation error if message is not provided", async () => {
    const response = await request(app)
      .post(`/messages/${user2.id}`)
      .send({})
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    expect(response.status).toBe(400);
  });
  it("should return validation error if param id is not an uuid", async () => {
    const response = await request(app)
      .post(`/messages/123`)
      .send({
        message: "teste",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    expect(response.status).toBe(400);
  });

  it("should return error if user send a message to himself", async () => {
    const response = await request(app)
      .post(`/messages/${user.id}`)
      .send({
        message: "teste",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    expect(response.status).toBe(403);
  });
});
