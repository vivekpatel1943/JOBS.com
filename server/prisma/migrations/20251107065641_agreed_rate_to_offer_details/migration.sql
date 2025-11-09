/*
  Warnings:

  - You are about to drop the column `agreedRate` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `JobApplication` table. All the data in the column will be lost.
  - Added the required column `employerId` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offerDetails` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."JobApplication" DROP CONSTRAINT "JobApplication_userId_fkey";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "agreedRate",
DROP COLUMN "userId",
ADD COLUMN     "employerId" TEXT NOT NULL,
ADD COLUMN     "offerDetails" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
