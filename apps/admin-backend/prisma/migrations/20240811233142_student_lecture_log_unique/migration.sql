/*
  Warnings:

  - A unique constraint covering the columns `[studentId,lectureId]` on the table `StudentLectureLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `StudentLectureLog_studentId_lectureId_key` ON `StudentLectureLog`(`studentId`, `lectureId`);
