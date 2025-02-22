import { PrismaClient } from "@prisma/client";
import {
  ADMIN,
  STUDENT,
  SEMESTER,
  LECTURE,
  STUDENT_LECTURE_LOG,
  WEEKLY_ATTEND_LOG,
  REFUND_POLICY,
  TASK,
} from "./mock";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.admin.deleteMany();
  await prisma.student.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.lecture.deleteMany();
  await prisma.studentLectureLog.deleteMany();
  await prisma.weeklyAttendLog.deleteMany();

  const hashedAdminData = await Promise.all(
    ADMIN.map(async (admin) => {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      return {
        ...admin,
        password: hashedPassword,
      };
    })
  );

  // 목 데이터 삽입
  await prisma.admin.createMany({
    data: hashedAdminData,
    skipDuplicates: true,
  });

  await prisma.student.createMany({
    data: STUDENT,
    skipDuplicates: true,
  });

  await prisma.semester.createMany({
    data: SEMESTER,
    skipDuplicates: true,
  });

  await prisma.lecture.createMany({
    data: LECTURE,
    skipDuplicates: true,
  });

  await prisma.task.createMany({
    data: TASK,
    skipDuplicates: true,
  });

  await prisma.studentLectureLog.createMany({
    data: STUDENT_LECTURE_LOG,
    skipDuplicates: true,
  });

  await prisma.weeklyAttendLog.createMany({
    data: WEEKLY_ATTEND_LOG,
    skipDuplicates: true,
  });

  await prisma.refundPolicy.createMany({
    data: REFUND_POLICY,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
