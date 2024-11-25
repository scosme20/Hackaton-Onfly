/*
  Warnings:

  - You are about to alter the column `latitude` on the `accommodations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Double`.
  - You are about to alter the column `longitude` on the `accommodations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Double`.

*/
-- AlterTable
ALTER TABLE `accommodations` MODIFY `latitude` DOUBLE NOT NULL,
    MODIFY `longitude` DOUBLE NOT NULL;
