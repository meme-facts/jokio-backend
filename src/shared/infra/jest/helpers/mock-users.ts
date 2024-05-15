import { UserDto } from "@modules/users/infra/class-validator/user/User.dto";
import { prisma } from "@shared/container";
import { validateAndTransformData } from "@shared/infra/http/middlewares/helpers/validators/TransformAndValidate";
import { hash } from "bcryptjs";

export async function mockUsers() {
  const password = await hash("testpassword", 8);
  const user = await prisma.users.create({
    data: {
      full_name: "test 1",
      nickname: "nickname 1",
      email: "test1@test.com",
      password,
      isPrivate: false,
    },
  });
  const user2 = await prisma.users.create({
    data: {
      full_name: "test 2",
      nickname: "nickname 2",
      email: "test2@test.com",
      password,
      isPrivate: false,
    },
  });
  const user3 = await prisma.users.create({
    data: {
      full_name: "test 3",
      nickname: "nickname 3",
      email: "test3@test.com",
      password,
      isPrivate: false,
    },
  });
  return [
    await validateAndTransformData(UserDto, user),
    await validateAndTransformData(UserDto, user2),
    await validateAndTransformData(UserDto, user3),
  ];
}
