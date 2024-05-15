import { FollowerStatusEnum } from "@modules/posts/enums/StatusEnum";
import { CreatePostDto } from "@modules/posts/infra/class-validator/posts/CreatePost.dto";
import { prisma } from "@shared/container";
import { app } from "@shared/infra/http/app";
import { IUserForTest, user } from "@shared/infra/jest/jest.setup";

import request from "supertest";

describe("ReturnPostByUserNicknameController E2E test", () => {
  const user2: IUserForTest = {
    full_name: "John Doe2",
    nickname: "john_doe2",
    email: "joni2@hotmail.com",
    password: "12345678",
  };
  const postCount = 20;
  const limit = 10;
  let posts: CreatePostDto[];
  beforeEach(async () => {
    posts = Array.from({ length: postCount }).map((_, i) => {
      const post: CreatePostDto = {
        postDescription: `test ${i + 1}`,
        img_url: "https://www.posttest.com",
        user_id: user.id,
        isActive: true,
      };
      return post;
    });
    const user2Resp = await request(app).post("/users").send(user2);

    Object.assign(user2, {
      token: user2Resp.body.token,
      id: user2Resp.body.id,
    });

    await prisma.posts.createMany({
      data: posts,
    });
  });

  it("should return status code 200 and bring posts from user paginated at first page", async () => {
    const response = await request(app)
      .get(`/post/${user.nickname}`)
      .set("Authorization", `Bearer ${user.token}`)
      .query({ page: 1, limit });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(postCount);
    expect(response.body.posts.length).toBe(limit);
    expect(response.body.posts[0]).toEqual(expect.objectContaining(posts[0]));
  });

  it("should return status code 200 and bring posts from user paginated at second page", async () => {
    const response = await request(app)
      .get(`/post/${user.nickname}`)
      .set("Authorization", `Bearer ${user.token}`)
      .query({ page: 2, limit });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(postCount);
    expect(response.body.posts.length).toBe(limit);
    expect(response.body.posts[0]).toEqual(
      expect.objectContaining(posts[limit])
    );
  });

  it("should return status code 200 with relation status O when logged user is the same as nickname", async () => {
    const response = await request(app)
      .get(`/post/${user.nickname}`)
      .set("Authorization", `Bearer ${user.token}`)
      .query({ page: 1, limit });

    expect(response.status).toBe(200);
    expect(response.body.relationStatus).toBe(FollowerStatusEnum.OWNER);
  });

  it("should return status code 200 with relation status U when logged user is not the same as params nickname and they do not have a relation", async () => {
    const response = await request(app)
      .get(`/post/${user.nickname}`)
      .set("Authorization", `Bearer ${user2.token}`)
      .query({ page: 1, limit });

    expect(response.status).toBe(200);
    expect(response.body.relationStatus).toBe(FollowerStatusEnum.UNKNOWN);
  });

  it("should return status code 200 with relation status A when logged user is not the same as params nickname and they have a relation", async () => {
    await request(app)
      .post(`/followers/${user.id}`)
      .set("Authorization", `Bearer ${user2.token}`);
    const response = await request(app)
      .get(`/post/${user.nickname}`)
      .set("Authorization", `Bearer ${user2.token}`)
      .query({ page: 1, limit });

    expect(response.status).toBe(200);
    expect(response.body.relationStatus).toBe(FollowerStatusEnum.Accepted);
  });

  it("should return status code 401 when do not send a valid token", async () => {
    const response = await request(app)
      .get(`/post/${user.nickname}`)
      .query({ page: 1, limit });

    expect(response.status).toBe(401);
  });

  it("should return status code 404 when send a invalid username", async () => {
    const response = await request(app)
      .get(`/post/wrong-nickname`)
      .set("Authorization", `Bearer ${user.token}`)
      .query({ page: 1, limit });

    expect(response.status).toBe(404);
  });
  it("should return status code 400 when send a invalid query params", async () => {
    const response = await request(app)
      .get(`/post/wrong-nickname`)
      .set("Authorization", `Bearer ${user.token}`);

    expect(response.status).toBe(400);
  });
});
