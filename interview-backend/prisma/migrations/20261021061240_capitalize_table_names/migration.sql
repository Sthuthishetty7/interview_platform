/*
  Warnings:

  - You are about to drop the `InterviewNote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterviewNote" DROP CONSTRAINT "InterviewNote_interviewId_fkey";

-- DropTable
DROP TABLE "InterviewNote";

-- CreateTable
CREATE TABLE "Interviewer Notes" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "interviewId" INTEGER NOT NULL,

    CONSTRAINT "Interviewer Notes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interviewer Notes" ADD CONSTRAINT "Interviewer Notes_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
