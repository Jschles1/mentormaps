/*
  Warnings:

  - You are about to drop the column `startedAt` on the `Milestone` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Roadmap` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Roadmap` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "startedAt";

-- AlterTable
ALTER TABLE "Roadmap" DROP COLUMN "completedAt",
DROP COLUMN "startedAt";
