import { app } from "@shared/infra/http/app";
import { IUserForTest, user } from "@shared/infra/jest/jest.setup";
import { randomUUID } from "crypto";
import request from "supertest";

describe("GetAllConversationsController", () => {
  const user2: IUserForTest = {
    full_name: "John Doe",
    nickname: "john_doe2",
    email: "jon2@you.com",
    password: "123345678",
  };
  const user3: IUserForTest = {
    full_name: "John Doe",
    nickname: "john_doe3",
    email: "jon3@you.com",
    password: "123345678",
  };

  beforeEach(async () => {
    const user1Response = await request(app).post("/users").send(user2);
    const user2Response = await request(app).post("/users").send(user3);
    Object.assign(user2, {
      id: user1Response.body.id,
      token: user1Response.body.token,
    });
    Object.assign(user3, {
      id: user2Response.body.id,
      token: user2Response.body.token,
    });
  });

  it("should be able to get all conversations from a user", async () => {
    await request(app)
      .post(`/messages/${user2.id}`)
      .send({
        message: "teste",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    await request(app)
      .post(`/messages/${user3.id}`)
      .send({
        message: "teste",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    const response = await request(app)
      .get("/messages")
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it("should not be able to make the request without a token", async () => {
    const response = await request(app).get("/messages");
    expect(response.status).toBe(401);
  });
  it("should not be able to make the request without a valid token", async () => {
    const response = await request(app)
      .get("/messages")
      .set({
        Authorization: `Bearer ${randomUUID()}`,
      });
    expect(response.status).toBe(401);
  });

  it("should be able to group by conversation", async () => {
    await request(app)
      .post(`/messages/${user2.id}`)
      .send({
        message: "teste",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });

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

    await request(app)
      .post(`/messages/${user3.id}`)
      .send({
        message: "teste",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    const response = await request(app)
      .get("/messages")
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it("should be able to get only the last message from a conversation", async () => {
    await request(app)
      .post(`/messages/${user2.id}`)
      .send({
        message: "teste1",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });

    await request(app)
      .post(`/messages/${user2.id}`)
      .send({
        message: "teste2",
      })
      .set({
        Authorization: `Bearer ${user.token}`,
      });

    await request(app)
      .post(`/messages/${user.id}`)
      .send({
        message: "teste3",
      })
      .set({
        Authorization: `Bearer ${user2.token}`,
      });

    const response = await request(app)
      .get("/messages")
      .set({
        Authorization: `Bearer ${user.token}`,
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].message).toBe("teste3");
  });
});
