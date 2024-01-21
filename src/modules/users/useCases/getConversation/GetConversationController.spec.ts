import { app } from "@shared/infra/http/app";
import { IUserForTest, user } from "@shared/infra/jest/jest.setup";
import { randomUUID } from "crypto";
import e from "express";
import request from "supertest";

describe("GetConversationController", () => {
  const user2: IUserForTest = {
    full_name: "John Doe2",
    nickname: "john_doe2",
    email: "joni2@test.ui",
    password: "12345678",
  };

  beforeEach(async () => {
    const user2Resp = await request(app).post("/users").send(user2);

    Object.assign(user2, {
      token: user2Resp.body.token,
      id: user2Resp.body.id,
    });
  });
  it("should be able to get a conversation between two users", async () => {
    await request(app)
      .post(`/messages/${user2.id}`)
      .send({
        message: "teste",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });

    await request(app)
      .post(`/messages/${user.id}`)
      .send({
        message: "teste",
      })
      .set({
        Authorization: `Bearer ${user2.token}`,
      });

    const response = await request(app)
      .get(`/messages/${user2.id}`)
      .set({
        Authorization: `Bearer ${user.token}`,
      })
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
  it("should not be able to get a conversation without a valid token", async () => {
    const response = await request(app)
      .get(`/messages/${user2.id}`)
      .set({
        Authorization: `Bearer ${randomUUID()}`,
      })
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(401);
  });
  it("should not be able to get a conversation if the user does not exists", async () => {
    const response = await request(app)
      .get(`/messages/${randomUUID()}`)
      .set({
        Authorization: `Bearer ${user.token}`,
      })
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(404);
  });
  it("should return validation error if the user id is not uuid", async () => {
    const response = await request(app)
      .get(`/messages/123`)
      .set({
        Authorization: `Bearer ${user.token}`,
      })
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
  it("should return validation error if page is not sent", async () => {
    const response = await request(app)
      .get(`/messages/${user2.id}`)
      .set({
        Authorization: `Bearer ${user.token}`,
      })
      .query({ limit: 10 });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
  it("should return validation error if limit is not sent", async () => {
    const response = await request(app)
      .get(`/messages/${user2.id}`)
      .set({
        Authorization: `Bearer ${user.token}`,
      })
      .query({ page: 1 });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
  it("should not be able to get a conversation with yourself", async () => {
    const response = await request(app)
      .get(`/messages/${user.id}`)
      .set({
        Authorization: `Bearer ${user.token}`,
      })
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(403);
  });
});
