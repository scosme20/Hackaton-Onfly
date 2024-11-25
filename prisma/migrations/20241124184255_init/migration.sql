/*
  Warnings:

  - You are about to alter the column `latitude` on the `accommodations` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(255)`.
  - You are about to alter the column `longitude` on the `accommodations` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `accommodations` MODIFY `latitude` VARCHAR(255) NOT NULL,
    MODIFY `longitude` VARCHAR(255) NOT NULL;
