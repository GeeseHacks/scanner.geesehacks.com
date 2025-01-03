-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'WAITLIST', 'NOT_APPLIED', 'APPLIED', 'CONFIRMED');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(36) NOT NULL,
    "firstname" VARCHAR(50) NOT NULL,
    "lastname" VARCHAR(50) NOT NULL,
    "age" INTEGER NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "school" VARCHAR(100) NOT NULL,
    "level_of_study" VARCHAR(100) NOT NULL,
    "country_of_residence" VARCHAR(255) NOT NULL,
    "dietary_restrictions" VARCHAR(100) NOT NULL,
    "github" VARCHAR(255),
    "linkedin" VARCHAR(255),
    "personal_website" VARCHAR(255),
    "MLH_authorize" BOOLEAN,
    "field_of_study" VARCHAR(100) NOT NULL,
    "optional_consider" VARCHAR(255),
    "optional_gender" VARCHAR(50),
    "optional_pronouns" VARCHAR(50),
    "optional_race" VARCHAR(50),
    "optional_underrepresented" TEXT,
    "other_dietary_restrictions" VARCHAR(100),
    "resume" VARCHAR(255),
    "t_shirt_size" VARCHAR(50),
    "status" "UserStatus" NOT NULL,
    "attendedEventIds" JSONB,
    "event_qr_code" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationResponse" (
    "id" VARCHAR(36) NOT NULL,
    "userid" TEXT NOT NULL,
    "q1" VARCHAR(1000) NOT NULL,
    "q2" VARCHAR(1000) NOT NULL,

    CONSTRAINT "ApplicationResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuth" (
    "id" VARCHAR(36) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "resetToken" VARCHAR(255),
    "tokenExpiration" TIMESTAMP(3),

    CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScannerUserAuth" (
    "id" VARCHAR(36) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(60) NOT NULL,

    CONSTRAINT "ScannerUserAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventParticipation" (
    "id" SERIAL NOT NULL,
    "eventName" VARCHAR(255) NOT NULL,
    "projectId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EventParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "judgeId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Judge" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "company" VARCHAR(255),
    "isGuest" BOOLEAN NOT NULL DEFAULT false,
    "availableFunds" INTEGER NOT NULL DEFAULT 10000,

    CONSTRAINT "Judge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JudgePair" (
    "id" SERIAL NOT NULL,
    "primaryJudgeId" INTEGER NOT NULL,
    "secondaryJudgeId" INTEGER NOT NULL,

    CONSTRAINT "JudgePair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "totalInvestment" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JudgePairTeams" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_event_qr_code_key" ON "User"("event_qr_code");

-- CreateIndex
CREATE INDEX "ApplicationResponse_userid_idx" ON "ApplicationResponse"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_email_key" ON "UserAuth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ScannerUserAuth_email_key" ON "ScannerUserAuth"("email");

-- CreateIndex
CREATE INDEX "EventParticipation_projectId_idx" ON "EventParticipation"("projectId");

-- CreateIndex
CREATE INDEX "Investment_judgeId_idx" ON "Investment"("judgeId");

-- CreateIndex
CREATE INDEX "Investment_projectId_idx" ON "Investment"("projectId");

-- CreateIndex
CREATE INDEX "Judge_name_idx" ON "Judge"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JudgePair_primaryJudgeId_secondaryJudgeId_key" ON "JudgePair"("primaryJudgeId", "secondaryJudgeId");

-- CreateIndex
CREATE INDEX "Project_name_idx" ON "Project"("name");

-- CreateIndex
CREATE INDEX "Tag_projectId_idx" ON "Tag"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "_JudgePairTeams_AB_unique" ON "_JudgePairTeams"("A", "B");

-- CreateIndex
CREATE INDEX "_JudgePairTeams_B_index" ON "_JudgePairTeams"("B");

-- AddForeignKey
ALTER TABLE "ApplicationResponse" ADD CONSTRAINT "ApplicationResponse_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipation" ADD CONSTRAINT "EventParticipation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "Judge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JudgePair" ADD CONSTRAINT "JudgePair_primaryJudgeId_fkey" FOREIGN KEY ("primaryJudgeId") REFERENCES "Judge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JudgePair" ADD CONSTRAINT "JudgePair_secondaryJudgeId_fkey" FOREIGN KEY ("secondaryJudgeId") REFERENCES "Judge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JudgePairTeams" ADD CONSTRAINT "_JudgePairTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "JudgePair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JudgePairTeams" ADD CONSTRAINT "_JudgePairTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

