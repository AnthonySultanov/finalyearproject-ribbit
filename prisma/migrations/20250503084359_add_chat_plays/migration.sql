/*
  Warnings:

  - The primary key for the `blocking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `following` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `userlogged` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "blocking" DROP CONSTRAINT "blocking_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "blocking" DROP CONSTRAINT "blocking_blockerId_fkey";

-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "following_followerId_fkey";

-- DropForeignKey
ALTER TABLE "following" DROP CONSTRAINT "following_followingId_fkey";

-- AlterTable
ALTER TABLE "blocking" DROP CONSTRAINT "blocking_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "blockerId" SET DATA TYPE TEXT,
ALTER COLUMN "blockedId" SET DATA TYPE TEXT,
ADD CONSTRAINT "blocking_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "following" DROP CONSTRAINT "following_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "followerId" SET DATA TYPE TEXT,
ALTER COLUMN "followingId" SET DATA TYPE TEXT,
ADD CONSTRAINT "following_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "streaming" ADD COLUMN     "allowedChatKeys" TEXT NOT NULL DEFAULT 'wasd',
ADD COLUMN     "isChatPlaysEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "userlogged" DROP CONSTRAINT "userlogged_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "userlogged_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "userlogged"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "userlogged"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocking" ADD CONSTRAINT "blocking_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "userlogged"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocking" ADD CONSTRAINT "blocking_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "userlogged"("id") ON DELETE CASCADE ON UPDATE CASCADE;
