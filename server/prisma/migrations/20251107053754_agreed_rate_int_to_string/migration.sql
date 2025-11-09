/*
  Warnings:

  - You are about to drop the column `agreedPrice` on the `Job` table. All the data in the column will be lost.
  - Added the required column `agreedRate` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "agreedPrice",
ADD COLUMN     "agreedRate" TEXT;

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "agreedRate" TEXT NOT NULL;
