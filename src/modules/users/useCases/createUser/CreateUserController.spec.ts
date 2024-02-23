import { app } from "@shared/infra/http/app";
import request from "supertest";
describe("CreateUserController", () => {
  it("should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      full_name: "John Doe",
      nickname: "john_doe2",
      email: "test@ui.com",
      password: "12345678",
    });
    expect(response.status).toBe(201);
  });
  it("should return validation error when create a new user with an already used email", async () => {
    await request(app).post("/users").send({
      full_name: "John Doe",
      nickname: "john_doe2",
      email: "test@ui.com",
      password: "12345678",
    });
    const response = await request(app).post("/users").send({
      full_name: "John Doe",
      nickname: "john_doe3",
      email: "test@ui.com",
      password: "12345678",
    });
    expect(response.status).toBe(409);
  });
  it("should return validation error when create a new user with an already used nickname", async () => {
    await request(app).post("/users").send({
      full_name: "John Doe",
      nickname: "john_doe2",
      email: "test@ui.com",
      password: "12345678",
    });
    const response = await request(app).post("/users").send({
      full_name: "John Doe",
      nickname: "john_doe2",
      email: "test2@ui.com",
      password: "12345678",
    });
    expect(response.status).toBe(409);
  });
  it("should return validation error when create a new user with an invalid email", async () => {
    const response = await request(app).post("/users").send({
      full_name: "John Doe",
      nickname: "john_doe2",
      email: "testui.com",
      password: "12345678",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
  it("should return validation error when create a new user with an invalid password", async () => {
    const response = await request(app).post("/users").send({
      full_name: "John Doe",
      nickname: "john_doe2",
      email: "jon@2.com",
      password: "123",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
  it("should return validation error when create a new user with an invalid nickname", async () => {
    const response = await request(app).post("/users").send({
      full_name: "John Doe",
      nickname: "jo",
      email: "daw@dawdaw.com",
      password: "12345678",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
  it("should return validation error when create a new user with an invalid full name", async () => {
    const response = await request(app).post("/users").send({
      full_name: "J",
      nickname: "john_doe2",
      email: "312@ui.com",
      password: "12345678",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Validation failed");
  });
});
