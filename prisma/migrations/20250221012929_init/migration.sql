-- CreateTable
CREATE TABLE "userlogged" (
      id String @id @default(uuid())
  username String @unique
  imageUrl String @db.Text
  externalUserId String @unique
  bio String? @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

    CONSTRAINT "userlogged_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userlogged_username_key" ON "userlogged"("username");

-- CreateIndex
CREATE UNIQUE INDEX "userlogged_externalUserId_key" ON "userlogged"("externalUserId");
