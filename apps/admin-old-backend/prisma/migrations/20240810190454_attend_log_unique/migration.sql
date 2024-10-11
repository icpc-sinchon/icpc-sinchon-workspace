/*
  Warnings:

  - A unique constraint covering the columns `[studentId,lectureId,round]` on the table `WeeklyAttendLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `WeeklyAttendLog_studentId_lectureId_round_key` ON `WeeklyAttendLog`(`studentId`, `lectureId`, `round`);
