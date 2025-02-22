/*
  Warnings:

  - You are about to alter the column `refundOption` on the `studentlecturelog` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `studentlecturelog` MODIFY `refundOption` ENUM('Refund', 'NonRefund') NOT NULL DEFAULT 'Refund';
