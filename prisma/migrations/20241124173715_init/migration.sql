-- CreateTable
CREATE TABLE `accommodations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `stars` INTEGER NOT NULL,
    `latitude` VARCHAR(255) NOT NULL,
    `longitude` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `address` VARCHAR(255) NOT NULL,
    `district` VARCHAR(255) NULL,
    `city` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `placeId` VARCHAR(255) NOT NULL,
    `thumb` VARCHAR(255) NULL,
    `images` JSON NULL,
    `amenities` JSON NULL,
    `pois` JSON NULL,
    `reviews` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cnpj` VARCHAR(20) NULL,
    `type` ENUM('HOTEL', 'HOSTEL', 'APARTMENT', 'RESORT', 'INN', 'MOTEL', 'GUESTHOUSE', 'VILLA', 'COTTAGE', 'CABIN') NOT NULL,
    `type_number` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
