import { app } from "@shared/infra/http/app";
import { IUserForTest, user } from "@shared/infra/jest/jest.setup";
import request from "supertest";

describe("CheckEmailAvailabilityController e2e", () => {
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
  it("should return 200 with response false when passing an existing email", async () => {
    const response = await request(app)
      .get(`/users/email/${user.email}/is-available`)
      .set({
        Authorization: `Bearer ${user2.token}`,
      });

    expect(response.body).toBe(false);
    expect(response.status).toBe(200);
  });

  it("should return 200 with response true when passing an non-existing email", async () => {
    const response = await request(app)
      .get(`/users/email/non-existing/is-available`)
      .set({
        Authorization: `Bearer ${user2.token}`,
      });

    expect(response.body).toBe(true);
    expect(response.status).toBe(200);
  });

  it("should return 200 with response true when passing same name as loggeduser email", async () => {
    const response = await request(app)
      .get(`/users/email/${user.email}/is-available`)
      .set({
        Authorization: `Bearer ${user.token}`,
      });

    expect(response.body).toBe(true);
    expect(response.status).toBe(200);
  });

  it("should return 401 when send a request without a valid token", async () => {
    const response = await request(app).get(
      `/users/email/non-existing/is-available`
    );

    expect(response.status).toBe(401);
  });
});
