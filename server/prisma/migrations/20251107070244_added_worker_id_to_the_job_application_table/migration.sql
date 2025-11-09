/*
  Warnings:

  - Added the required column `workerId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "workerId" TEXT NOT NULL;
