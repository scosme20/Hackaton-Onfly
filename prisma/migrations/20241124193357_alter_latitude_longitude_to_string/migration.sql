-- CreateTable
CREATE TABLE `accommodations_filter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('HOTEL', 'HOSTEL', 'APARTMENT', 'RESORT', 'INN', 'MOTEL', 'GUESTHOUSE', 'VILLA', 'COTTAGE', 'CABIN') NULL,
    `type_number` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
