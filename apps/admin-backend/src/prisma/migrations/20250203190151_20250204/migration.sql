/*
  Warnings:

  - The values [Intermediate] on the enum `Lecture_level` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `paymentStatus` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `refundAccount` on the `student` table. All the data in the column will be lost.
  - Added the required column `refundAccount` to the `StudentLectureLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lecture` MODIFY `level` ENUM('Novice', 'Advanced', 'Expert') NOT NULL DEFAULT 'Novice';

-- AlterTable
ALTER TABLE `student` DROP COLUMN `paymentStatus`,
    DROP COLUMN `refundAccount`;

-- AlterTable
ALTER TABLE `studentlecturelog` ADD COLUMN `refundAccount` VARCHAR(191) NOT NULL,
    ADD COLUMN `refundOption` ENUM('Refundable', 'Nonrefundable') NOT NULL DEFAULT 'Refundable';
