-- CreateTable
CREATE TABLE `Period` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `time` VARCHAR(191) NOT NULL DEFAULT '',
    `frequency` INTEGER NOT NULL DEFAULT 0,
    `day` VARCHAR(191) NOT NULL DEFAULT '',
    `loc` ENUM('Marino2Floor', 'MarinoGymnasium', 'Marino3Floor', 'MarinoCardio', 'MarinoTrack', 'SquashBusters') NOT NULL DEFAULT 'MarinoCardio',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
