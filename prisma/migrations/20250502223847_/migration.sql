-- CreateTable
CREATE TABLE "userlogged" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "externalUserId" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userlogged_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "following" (
    "id" UUID NOT NULL,
    "followerId" UUID NOT NULL,
    "followingId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "following_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocking" (
    "id" UUID NOT NULL,
    "blockerId" UUID NOT NULL,
    "blockedId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streaming" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "ingressId" TEXT,
    "serverUrl" TEXT,
    "streamingKey" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "isChatEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isChatDelaymode" BOOLEAN NOT NULL DEFAULT false,
    "isChatFollowersOnly" BOOLEAN NOT NULL DEFAULT false,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "streaming_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userlogged_username_key" ON "userlogged"("username");

-- CreateIndex
CREATE UNIQUE INDEX "userlogged_externalUserId_key" ON "userlogged"("externalUserId");

-- CreateIndex
CREATE INDEX "following_followerId_idx" ON "following"("followerId");

-- CreateIndex
CREATE INDEX "following_followingId_idx" ON "following"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "following_followerId_followingId_key" ON "following"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "blocking_blockerId_idx" ON "blocking"("blockerId");

-- CreateIndex
CREATE INDEX "blocking_blockedId_idx" ON "blocking"("blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "blocking_blockerId_blockedId_key" ON "blocking"("blockerId", "blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "streaming_ingressId_key" ON "streaming"("ingressId");

-- CreateIndex
CREATE UNIQUE INDEX "streaming_userId_key" ON "streaming"("userId");

-- CreateIndex
CREATE INDEX "streaming_userId_idx" ON "streaming"("userId");

-- CreateIndex
CREATE INDEX "streaming_ingressId_idx" ON "streaming"("ingressId");

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "userlogged"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "userlogged"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocking" ADD CONSTRAINT "blocking_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "userlogged"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocking" ADD CONSTRAINT "blocking_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "userlogged"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streaming" ADD CONSTRAINT "streaming_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userlogged"("id") ON DELETE CASCADE ON UPDATE CASCADE;
