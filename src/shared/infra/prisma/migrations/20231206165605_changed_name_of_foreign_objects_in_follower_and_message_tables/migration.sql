/*
  Warnings:

  - You are about to drop the column `fromUser` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `toUser` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `fromUserId` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "FKUserFollowerRequested";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "FKUserFollowerRequester";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "fromUser",
DROP COLUMN "toUser",
ADD COLUMN     "fromUserId" UUID NOT NULL,
ADD COLUMN     "toUserId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "FKUserFollowerRequested" FOREIGN KEY ("fromUserId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "FKUserFollowerRequester" FOREIGN KEY ("toUserId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;
