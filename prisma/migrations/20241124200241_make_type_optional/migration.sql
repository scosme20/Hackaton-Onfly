/*
  Warnings:

  - You are about to drop the `accommodations_filter` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `accommodations` MODIFY `type` ENUM('HOTEL', 'HOSTEL', 'APARTMENT', 'RESORT', 'INN', 'MOTEL', 'GUESTHOUSE', 'VILLA', 'COTTAGE', 'CABIN') NULL,
    MODIFY `type_number` INTEGER NULL DEFAULT 1;

-- DropTable
DROP TABLE `accommodations_filter`;
