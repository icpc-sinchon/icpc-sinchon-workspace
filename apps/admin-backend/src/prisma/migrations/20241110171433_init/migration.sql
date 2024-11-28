-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `bojHandle` VARCHAR(50) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `school` ENUM('YONSEI', 'SOGANG', 'HONGIK', 'EWHA', 'SOOKMYUNG') NOT NULL DEFAULT 'SOGANG',
    `studentNumber` VARCHAR(20) NOT NULL,
    `paymentStatus` ENUM('PAID_30000', 'PAID_60000') NOT NULL DEFAULT 'PAID_30000',
    `refundAccount` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Student_bojHandle_key`(`bojHandle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Semester` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `season` ENUM('Spring', 'Summer', 'Fall', 'Winter') NOT NULL DEFAULT 'Summer',

    UNIQUE INDEX `Semester_year_season_key`(`year`, `season`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lecture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` ENUM('Novice', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Novice',
    `lectureNumber` INTEGER NOT NULL DEFAULT 10,
    `bojGroupId` INTEGER NOT NULL,
    `semesterId` INTEGER NOT NULL,

    INDEX `semesterId`(`semesterId`),
    UNIQUE INDEX `Lecture_semesterId_level_key`(`semesterId`, `level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round` INTEGER NOT NULL,
    `practiceId` INTEGER NOT NULL,
    `lectureId` INTEGER NOT NULL,
    `minSolveCount` INTEGER NOT NULL,

    INDEX `lectureId`(`lectureId`),
    UNIQUE INDEX `Task_lectureId_round_key`(`lectureId`, `round`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Problem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bojProblemNumber` INTEGER NOT NULL,
    `essential` BOOLEAN NOT NULL DEFAULT true,
    `taskId` INTEGER NOT NULL,

    INDEX `taskId`(`taskId`),
    UNIQUE INDEX `Problem_taskId_bojProblemNumber_key`(`taskId`, `bojProblemNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefundPolicy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('LECTURE', 'TASK') NOT NULL,
    `minAttend` INTEGER NOT NULL,
    `maxAttend` INTEGER NOT NULL,
    `refundAmount` INTEGER NOT NULL,
    `semesterId` INTEGER NOT NULL,

    INDEX `semesterId`(`semesterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentLectureLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `lectureId` INTEGER NOT NULL,
    `isInvited` BOOLEAN NOT NULL DEFAULT false,
    `isCancelled` BOOLEAN NOT NULL DEFAULT false,

    INDEX `lectureId`(`lectureId`),
    INDEX `studentId`(`studentId`),
    UNIQUE INDEX `StudentLectureLog_studentId_lectureId_key`(`studentId`, `lectureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeeklyAttendLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round` INTEGER NOT NULL,
    `lectureDone` BOOLEAN NOT NULL DEFAULT false,
    `taskDone` BOOLEAN NOT NULL DEFAULT false,
    `studentId` INTEGER NOT NULL,
    `lectureId` INTEGER NOT NULL,

    INDEX `lectureId`(`lectureId`),
    INDEX `studentId`(`studentId`),
    UNIQUE INDEX `WeeklyAttendLog_studentId_lectureId_round_key`(`studentId`, `lectureId`, `round`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lecture` ADD CONSTRAINT `Lecture_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `Semester`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Problem` ADD CONSTRAINT `Problem_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefundPolicy` ADD CONSTRAINT `RefundPolicy_semesterId_fkey` FOREIGN KEY (`semesterId`) REFERENCES `Semester`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentLectureLog` ADD CONSTRAINT `StudentLectureLog_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentLectureLog` ADD CONSTRAINT `StudentLectureLog_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeeklyAttendLog` ADD CONSTRAINT `WeeklyAttendLog_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `Lecture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeeklyAttendLog` ADD CONSTRAINT `WeeklyAttendLog_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
