import { prisma } from "@shared/container";

export async function resetDb() {
  await prisma.$transaction([
    prisma.postLikes.deleteMany(),
    prisma.postDislikes.deleteMany(),
    prisma.comments.deleteMany(),
    prisma.posts.deleteMany(),
    prisma.followers.deleteMany(),
    prisma.messages.deleteMany(),
    prisma.notifications.deleteMany(),
    prisma.templates.deleteMany(),
    prisma.users.deleteMany(),
  ]);
}
