import { app } from "@shared/infra/http/app";
import { user } from "@shared/infra/jest/jest.setup";
import request from "supertest";

describe("GetConversationController", () => {
  it("should be able to receive a token after send correct credentials", async () => {
    const response = await request(app).post("/users/login").send({
      login: user.email,
      password: user.password,
    });
    expect(response.status).toBe(200);
  });
  it("should not be able to receive a token after send incorrect password", async () => {
    const response = await request(app).post("/users/login").send({
      login: user.email,
      password: "wrong_password",
    });
    expect(response.status).toBe(401);
  });
  it("should not be able to receive a token after send incorrect login", async () => {
    const response = await request(app).post("/users/login").send({
      login: "wrong_login",
      password: user.password,
    });
    expect(response.status).toBe(401);
  });
  it("should be able to use a authenticated route", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${user.token}`)
      .query({ page: "1", limit: "10", user_reference: "J" });
    expect(response.status).toBe(200);
  });
});
