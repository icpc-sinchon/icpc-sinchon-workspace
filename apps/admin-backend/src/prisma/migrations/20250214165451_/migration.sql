/*
  Warnings:

  - You are about to drop the `lecture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `studentlecturelog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `lecture` DROP FOREIGN KEY `Lecture_semesterId_fkey`;
ALTER TABLE `Task` DROP FOREIGN KEY `Task_lectureId_fkey`;
ALTER TABLE `StudentLectureLog` DROP FOREIGN KEY `StudentLectureLog_lectureId_fkey`;
ALTER TABLE `StudentLectureLog` DROP FOREIGN KEY `StudentLectureLog_studentId_fkey`;
ALTER TABLE `WeeklyAttendLog` DROP FOREIGN KEY `WeeklyAttendLog_studentId_fkey`;
ALTER TABLE `WeeklyAttendLog` DROP FOREIGN KEY `WeeklyAttendLog_lectureId_fkey`;

-- DropTable
DROP TABLE `lecture`;

-- DropTable
DROP TABLE `student`;

-- DropTable
DROP TABLE `studentlecturelog`;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `bojHandle` VARCHAR(50) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `school` ENUM('YONSEI', 'SOGANG', 'HONGIK', 'EWHA', 'SOOKMYUNG') NOT NULL DEFAULT 'SOGANG',
    `studentNumber` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `Student_bojHandle_key`(`bojHandle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lecture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` ENUM('Novice', 'Advanced', 'Expert') NOT NULL DEFAULT 'Novice',
    `lectureNumber` INTEGER NOT NULL DEFAULT 10,
    `bojGroupId` INTEGER NOT NULL,
    `semesterId` INTEGER NOT NULL,

    INDEX `semesterId`(`semesterId`),
    UNIQUE INDEX `Lecture_semesterId_level_key`(`semesterId`, `level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentLectureLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `lectureId` INTEGER NOT NULL,
    `refundOption` ENUM('Refund', 'NonRefund') NOT NULL DEFAULT 'Refund',
    `refundAccount` VARCHAR(191) NOT NULL,
    `isInvited` BOOLEAN NOT NULL DEFAULT false,
    `isCancelled` BOOLEAN NOT NULL DEFAULT false,

    INDEX `lectureId`(`lectureId`),
    INDEX `studentId`(`studentId`),
    UNIQUE INDEX `StudentLectureLog_studentId_lectureId_key`(`studentId`, `lectureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lecture` ADD CONSTRAINT `Lecture_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `Semester`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentLectureLog` ADD CONSTRAINT `StudentLectureLog_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentLectureLog` ADD CONSTRAINT `StudentLectureLog_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeeklyAttendLog` ADD CONSTRAINT `WeeklyAttendLog_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeeklyAttendLog` ADD CONSTRAINT `WeeklyAttendLog_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
