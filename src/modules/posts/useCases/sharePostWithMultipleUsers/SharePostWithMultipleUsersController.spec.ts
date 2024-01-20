import { app } from "@shared/infra/http/app";
import { IUserForTest, user } from "@shared/infra/jest/jest.setup";
import { randomUUID } from "crypto";
import request from "supertest";

describe("SharePostWithMultipleUsersController", () => {
  const user2: IUserForTest = {
    full_name: "John Doe2",
    nickname: "john_doe2",
    email: "joni2@hotmail.com",
    password: "12345678",
  };
  const user3: IUserForTest = {
    full_name: "John Doe3",
    nickname: "john_doe3",
    email: "joni3@hotmail.com",
    password: "12345678",
  };
  let postId: string;
  beforeEach(async () => {
    const user2Resp = await request(app).post("/users").send(user2);
    const user3Resp = await request(app).post("/users").send(user3);
    Object.assign(user2, {
      token: user2Resp.body.token,
      id: user2Resp.body.id,
    });
    Object.assign(user3, {
      token: user3Resp.body.token,
      id: user3Resp.body.id,
    });
    const postResponse = await request(app)
      .post("/post")
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        postDescription: "teste",
        img_url: "https://teste.com",
      });
    postId = postResponse.body.id;
  });

  it("should be able to share a post with multiple users", async () => {
    const response = await request(app)
      .post(`/post/share/${postId}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        usersIds: [user2.id, user3.id],
      });

    const conversationWithUser2 = await request(app)
      .get(`/messages/${user2.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .query({ page: 1, limit: 10 });

    const conversationWithUser3 = await request(app)
      .get(`/messages/${user3.id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);

    expect(conversationWithUser2.body.length).toBe(1);
    expect(conversationWithUser3.body.length).toBe(1);
  });
  it("should not be able to share a post with multiple users if the post does not exist", async () => {
    const response = await request(app)
      .post(`/post/share/${randomUUID()}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        usersIds: [user2.id, user3.id],
      });

    expect(response.status).toBe(404);
  });

  it("should not be able to share a post with multiple users if some of the receivers does not exist", async () => {
    const response = await request(app)
      .post(`/post/share/${postId}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        usersIds: [user2.id, randomUUID()],
      });

    expect(response.status).toBe(404);
  });
  it("should not be able to share a post with multiple users without a valid token", async () => {
    const response = await request(app)
      .post(`/post/share/${postId}`)
      .send({
        usersIds: [user2.id, user3.id],
      });
    expect(response.status).toBe(401);
  });
  it("should not be able to share a post to yourself", async () => {
    const response = await request(app)
      .post(`/post/share/${postId}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        usersIds: [user.id, user3.id],
      });

    expect(response.status).toBe(403);
  });
  it("should return validation error when post id is not uuid", async () => {
    const response = await request(app)
      .post(`/post/share/123`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        usersIds: [user2.id, user3.id],
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
  it("should return validation error if one or more receivers ids are not uuids", async () => {
    const response = await request(app)
      .post(`/post/share/${postId}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        usersIds: [user2.id, "123"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
  it("should return validation error if userIds is not an array", async () => {
    const response = await request(app)
      .post(`/post/share/${postId}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        usersIds: "123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
  it("should return validation error if userIds is empty", async () => {
    const response = await request(app)
      .post(`/post/share/${postId}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send({
        usersIds: [],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
});
