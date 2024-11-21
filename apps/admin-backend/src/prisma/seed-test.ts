import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.admin.deleteMany();
  await prisma.studentLectureLog.deleteMany();
  await prisma.weeklyAttendLog.deleteMany();
  await prisma.student.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.lecture.deleteMany();
}

export default function setup() {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
