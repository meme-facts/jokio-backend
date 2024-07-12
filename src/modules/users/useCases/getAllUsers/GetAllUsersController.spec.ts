import { prisma } from "@shared/container";
import { app } from "@shared/infra/http/app";
import { IUserForTest, user } from "@shared/infra/jest/jest.setup";
import request from "supertest";
describe("GetAllUsersController e2e", () => {
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
  it("should return an empty array when user_reference does not match any user", async () => {
    const result = await request(app)
      .get(`/users`)
      .query({ page: 1, limit: 10, user_reference: "wrong_user" })
      .set({
        Authorization: `Bearer ${user.token}`,
      });

    expect(result.status).toBe(200);
    expect(result.body.users).toHaveLength(0);
    expect(result.body.count).toBe(0);
  });
  it("should filter by nickname", async () => {
    const result = await request(app)
      .get(`/users`)
      .query({ page: 1, limit: 10, user_reference: user2.nickname })
      .set({
        Authorization: `Bearer ${user.token}`,
      });

    expect(result.status).toBe(200);
    expect(result.body.users).toHaveLength(1);
    expect(result.body.count).toBe(1);
    expect(result.body.users[0].nickname).toBe(user2.nickname);
  });
  it("should filter by full name", async () => {
    const result = await request(app)
      .get(`/users`)
      .query({ page: 1, limit: 10, user_reference: user2.full_name })
      .set({
        Authorization: `Bearer ${user.token}`,
      });

    expect(result.status).toBe(200);
    expect(result.body.users).toHaveLength(1);
    expect(result.body.count).toBe(1);
    expect(result.body.users[0].full_name).toBe(user2.full_name);
  });

  it("should return users paginate and return count = totalUsers - loggedUser when page = 1", async () => {
    const limit = 10;
    const users = await prisma.users.createMany({
      data: Array.from({ length: 12 }).map((_, i) => ({
        full_name: `Teste da Silva${i + 1}`,
        nickname: `Silvon${i + 1}`,
        email: `silva@teste.com${i + 1}`,
        password: "1234",
      })),
    });
    const totalUsers = await prisma.users.count();
    const result = await request(app)
      .get(`/users`)
      .query({ page: 1, limit: 10 })
      .set({
        Authorization: `Bearer ${user.token}`,
      });

    expect(result.status).toBe(200);
    expect(result.body.users).toHaveLength(10);
    expect(result.body.count).toBe(totalUsers - 1);
  });
  it("should return users paginate and return count = totalUsers - loggedUser when page = 2", async () => {
    const limit = 10;
    const users = await prisma.users.createMany({
      data: Array.from({ length: 12 }).map((_, i) => ({
        full_name: `Teste da Silva${i + 1}`,
        nickname: `Silvon${i + 1}`,
        email: `silva@teste.com${i + 1}`,
        password: "1234",
      })),
    });
    const totalUsers = await prisma.users.count();
    const result = await request(app)
      .get(`/users`)
      .query({ page: 2, limit })
      .set({
        Authorization: `Bearer ${user.token}`,
      });

    expect(result.status).toBe(200);
    expect(result.body.users).toHaveLength(totalUsers - 1 - limit);
    expect(result.body.count).toBe(totalUsers - 1);
  });
});
