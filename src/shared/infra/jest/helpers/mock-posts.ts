import { PostDto } from "@modules/posts/infra/class-validator/posts/Post.dto";
import { prisma } from "@shared/container";
import { validateAndTransformData } from "@shared/infra/http/middlewares/helpers/validators/TransformAndValidate";

export async function mockPosts(userId: string) {
  const post = await prisma.posts.create({
    data: {
      postDescription: "test 1",
      user_id: userId,
      isActive: true,
    },
  });
  const post2 = await prisma.posts.create({
    data: {
      postDescription: "test 2",
      user_id: userId,
      isActive: true,
    },
  });
  const post3 = await prisma.posts.create({
    data: {
      postDescription: "test 3",
      user_id: userId,
      isActive: true,
    },
  });
  return [
    await validateAndTransformData(PostDto, post),
    await validateAndTransformData(PostDto, post2),
    await validateAndTransformData(PostDto, post3),
  ];
}
