import {
  RefundOption,
  type Admin,
  type Lecture,
  type RefundPolicy,
  type Semester,
  type Student,
  type StudentLectureLog,
  type Task,
  type WeeklyAttendLog,
} from "@prisma/client";

export const ADMIN: Admin[] = [
  {
    id: 1,
    username: "jungh",
    password: "1234",
  },
  {
    id: 2,
    username: "witch-test",
    password: "witch-password",
  },
];

export const STUDENT: Student[] = [
  {
    id: 1,
    name: "신정화",
    bojHandle: "shinjh",
    email: "shinjh@example.com",
    phone: "010-1111-1111",
    school: "EWHA",
    studentNumber: "20240001",
  },
  {
    id: 2,
    name: "김성현",
    bojHandle: "kimsh",
    email: "kimsh@example.com",
    phone: "010-2222-2222",
    school: "SOGANG",
    studentNumber: "20240002",
  },
  {
    id: 3,
    name: "천민재",
    bojHandle: "cheonmj",
    email: "cheonmj@example.com",
    phone: "010-3333-3333",
    school: "HONGIK",
    studentNumber: "20240003",
  },
  {
    id: 4,
    name: "이지언",
    bojHandle: "ez_code",
    email: "ezon@example.com",
    phone: "010-4444-4444",
    school: "YONSEI",
    studentNumber: "20240004",
  },
  {
    id: 5,
    name: "최연재",
    bojHandle: "yeonjae",
    email: "yeonjae@example.com",
    phone: "010-5555-5555",
    school: "SOOKMYUNG",
    studentNumber: "20240005",
  },
  {
    id: 6,
    name: "박민수",
    bojHandle: "bms",
    email: "bms@example.com",
    phone: "010-6666-6666",
    school: "YONSEI",
    studentNumber: "20240006",
  },
];

export const SEMESTER: Semester[] = [
  {
    id: 1,
    year: 2024,
    season: "Summer",
  },
  {
    id: 2,
    year: 2024,
    season: "Winter",
  },
  {
    id: 3,
    year: 2025,
    season: "Summer",
  },
];

export const LECTURE: Lecture[] = [
  {
    id: 1,
    level: "Novice",
    lectureNumber: 10,
    bojGroupId: 12343,
    semesterId: 1,
  },
  {
    id: 2,
    level: "Advanced",
    lectureNumber: 10,
    bojGroupId: 2345,
    semesterId: 1,
  },
  {
    id: 3,
    level: "Novice",
    lectureNumber: 10,
    bojGroupId: 3456,
    semesterId: 2,
  },
  {
    id: 4,
    level: "Advanced",
    lectureNumber: 10,
    bojGroupId: 4567,
    semesterId: 2,
  },
];

export const TASK: Task[] = [
  {
    id: 1,
    practiceId: 100,
    lectureId: 1,
    round: 1,
    minSolveCount: 3,
  },
  {
    id: 2,
    practiceId: 101,
    lectureId: 1,
    round: 2,
    minSolveCount: 3,
  },
  {
    id: 3,
    practiceId: 102,
    lectureId: 1,
    round: 3,
    minSolveCount: 3,
  },
  {
    id: 4,
    practiceId: 103,
    lectureId: 1,
    round: 4,
    minSolveCount: 3,
  },
  {
    id: 5,
    practiceId: 104,
    lectureId: 1,
    round: 5,
    minSolveCount: 3,
  },
  {
    id: 6,
    practiceId: 105,
    lectureId: 1,
    round: 6,
    minSolveCount: 3,
  },
  {
    id: 7,
    practiceId: 108,
    lectureId: 1,
    round: 7,
    minSolveCount: 3,
  },
  {
    id: 8,
    practiceId: 103,
    lectureId: 1,
    round: 8,
    minSolveCount: 3,
  },
  {
    id: 9,
    practiceId: 103,
    lectureId: 1,
    round: 9,
    minSolveCount: 3,
  },
  {
    id: 10,
    practiceId: 103,
    lectureId: 1,
    round: 10,
    minSolveCount: 3,
  },
];

export const STUDENT_LECTURE_LOG: StudentLectureLog[] = [
  {
    id: 1,
    studentId: 1,
    lectureId: 1,
    isInvited: true,
    isCancelled: false,
    refundAccount: "123-456-789",
    refundOption: RefundOption.Refund,
  },
  {
    id: 2,
    studentId: 2,
    lectureId: 2,
    isInvited: true,
    isCancelled: false,
    refundAccount: "349-123-456",
    refundOption: RefundOption.Refund,
  },
  {
    id: 3,
    studentId: 3,
    lectureId: 3,
    isInvited: true,
    isCancelled: false,
    refundAccount: "6892-123-456",
    refundOption: RefundOption.Refund,
  },
  {
    id: 4,
    studentId: 1,
    lectureId: 4,
    isInvited: true,
    isCancelled: false,
    refundAccount: "123-456-7892342",
    refundOption: RefundOption.Refund,
  },
  {
    id: 5,
    studentId: 2,
    lectureId: 1,
    isInvited: true,
    isCancelled: false,
    refundAccount: "123-456-723489",
    refundOption: RefundOption.NonRefund,
  },
  {
    id: 6,
    studentId: 3,
    lectureId: 1,
    isInvited: true,
    isCancelled: true,
    refundAccount: "123-456-723489",
    refundOption: RefundOption.NonRefund,
  },
  {
    id: 7,
    studentId: 4,
    lectureId: 2,
    isInvited: true,
    isCancelled: false,
    refundAccount: "123-456-789",
    refundOption: RefundOption.Refund,
  },
  {
    id: 8,
    studentId: 5,
    lectureId: 3,
    isInvited: true,
    isCancelled: false,
    refundAccount: "123-456-789",
    refundOption: RefundOption.Refund,
  },
];

export const WEEKLY_ATTEND_LOG: WeeklyAttendLog[] = [
  // 신정화의 강의 1 출석 기록 (10주차)
  ...Array(10)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      round: index + 1,
      lectureDone: index < 9, // 9주 출석
      taskDone: index < 8, // 8주 과제 완료
      studentId: 1,
      lectureId: 1,
    })),
  // 김성현의 강의 2 출석 기록 (10주차)
  ...Array(10)
    .fill(null)
    .map((_, index) => ({
      id: index + 11,
      round: index + 1,
      lectureDone: index < 8, // 8주 출석
      taskDone: index < 7, // 7주 과제 완료
      studentId: 2,
      lectureId: 2,
    })),
  // 천민재의 강의 3 출석 기록 (10주차)
  ...Array(10)
    .fill(null)
    .map((_, index) => ({
      id: index + 21,
      round: index + 1,
      lectureDone: index < 10, // 10주 모두 출석
      taskDone: index < 9, // 9주 과제 완료
      studentId: 3,
      lectureId: 3,
    })),
  // 신정화의 강의 4 출석 기록 (현재 5주차까지)
  ...Array(5)
    .fill(null)
    .map((_, index) => ({
      id: index + 31,
      round: index + 1,
      lectureDone: true, // 모든 강의 출석
      taskDone: index < 4, // 4주 과제 완료
      studentId: 1,
      lectureId: 4,
    })),
];

export const REFUND_POLICY: RefundPolicy[] = [
  {
    id: 1,
    type: "LECTURE",
    minAttend: 0,
    maxAttend: 5,
    refundAmount: 10000,
    semesterId: 1,
  },
  {
    id: 2,
    type: "TASK",
    minAttend: 0,
    maxAttend: 5,
    refundAmount: 20000,
    semesterId: 1,
  },
  {
    id: 3,
    type: "LECTURE",
    minAttend: 6,
    maxAttend: 8,
    refundAmount: 30000,
    semesterId: 1,
  },
  {
    id: 4,
    type: "TASK",
    minAttend: 6,
    maxAttend: 8,
    refundAmount: 40000,
    semesterId: 1,
  },
  {
    id: 5,
    type: "LECTURE",
    minAttend: 9,
    maxAttend: 10,
    refundAmount: 60000,
    semesterId: 1,
  },
  {
    id: 6,
    type: "TASK",
    minAttend: 9,
    maxAttend: 10,
    refundAmount: 30000,
    semesterId: 1,
  },
  {
    id: 7,
    type: "LECTURE",
    minAttend: 0,
    maxAttend: 6,
    refundAmount: 15000,
    semesterId: 2,
  },
  {
    id: 8,
    type: "TASK",
    minAttend: 0,
    maxAttend: 6,
    refundAmount: 25000,
    semesterId: 2,
  },
  {
    id: 9,
    type: "LECTURE",
    minAttend: 7,
    maxAttend: 10,
    refundAmount: 45000,
    semesterId: 2,
  },
  {
    id: 10,
    type: "TASK",
    minAttend: 7,
    maxAttend: 10,
    refundAmount: 35000,
    semesterId: 2,
  },
];
