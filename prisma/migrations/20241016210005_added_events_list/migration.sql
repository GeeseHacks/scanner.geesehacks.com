/*
  Warnings:

  - A unique constraint covering the columns `[event_qr_code]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "attendedEventIds" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "User_event_qr_code_key" ON "User"("event_qr_code");
