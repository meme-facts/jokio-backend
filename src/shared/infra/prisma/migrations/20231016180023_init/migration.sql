-- CreateTable
CREATE TABLE "Comments" (
    "id" UUID NOT NULL,
    "message" VARCHAR NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Followers" (
    "id" UUID NOT NULL,
    "fStatus" CHAR(1) NOT NULL,
    "requestedUserId" UUID NOT NULL,
    "requesterUserId" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_c90cfc5b18edd29bd15ba95c1a4" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" UUID NOT NULL,
    "message" VARCHAR NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "fromUser" UUID NOT NULL,
    "toUser" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" UUID NOT NULL,
    "type" CHAR(1) NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLikes" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_b524cbc038425198b8a12cc2e13" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostDislikes" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_b524cbc038425198b8a12cc2e14" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" UUID NOT NULL,
    "postDescription" VARCHAR NOT NULL,
    "img_url" VARCHAR,
    "isActive" BOOLEAN NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "dislikeCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Templates" (
    "id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "templateDescription" VARCHAR NOT NULL,
    "imgUrl" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeorm_metadata" (
    "type" VARCHAR NOT NULL,
    "database" VARCHAR,
    "schema" VARCHAR,
    "table" VARCHAR,
    "name" VARCHAR,
    "value" TEXT
);

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR,
    "nickname" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "img_url" VARCHAR,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "FKPostComment" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "FKUserComment" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "FKUserFollowerRequested" FOREIGN KEY ("requestedUserId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "FKUserFollowerRequester" FOREIGN KEY ("requesterUserId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "FKUserFollowerRequested" FOREIGN KEY ("fromUser") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "FKUserFollowerRequester" FOREIGN KEY ("toUser") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "FKPostComment" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "FKUserComment" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "FKPostPostReaction" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "FKUserPostReaction" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "PostDislikes" ADD CONSTRAINT "FKPostPostReaction" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "PostDislikes" ADD CONSTRAINT "FKUserPostReaction" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "FKUserPost" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE SET NULL;
