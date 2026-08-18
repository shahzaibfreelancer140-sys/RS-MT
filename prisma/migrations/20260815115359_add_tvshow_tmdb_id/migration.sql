/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `TVShow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TVShow" ADD COLUMN "tmdbId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "TVShow_tmdbId_key" ON "TVShow"("tmdbId");
