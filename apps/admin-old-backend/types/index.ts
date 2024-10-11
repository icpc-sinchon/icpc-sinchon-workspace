import type {
  RefundPolicy,
  Lecture,
  Semester,
  Student,
  Prisma,
} from "@icpc-sinchon/shared";

export type EmptyObject = Record<string, never>;

export type BojLoginCredentials = {
  boj_id: string;
  boj_pw: string;
};

export type SemesterQuery = {
  year: string;
  season: Semester["season"];
};

export type SemesterIdentifier = {
  year: Semester["year"];
  season: Semester["season"];
};

export type LectureQuery = {
  year: string;
  season: Semester["season"];
  lectureLevel: Lecture["level"];
};

export type LectureIdentifier = {
  year: Semester["year"];
  season: Semester["season"];
  level: Lecture["level"];
};

export type StudentPatchBody = {
  attendLog: StudentAttendance["attendLog"];
} & LectureQuery;

export type NewStudent = {
  name: string;
  bojHandle: string;
  email: string;
  phone: string;
  school: Student["school"];
  studentNumber: string;
  paymentStatus: Student["paymentStatus"];
  refundAccount: string;
  lectureInfo: LectureIdentifier;
};

// TODO: 모노레포 등으로 타입 통합하기
export type StudentAttendance = {
  studentId: number;
  lectureId: number;
  name: string;
  bojHandle?: string;
  refundAccount?: string;
  refundAmount?: number;
  paymentStatus: Student["paymentStatus"];
  attendLog: {
    round: number;
    lectureDone: boolean;
    taskDone: boolean;
  }[];
};

export type RefundPolicyInput = Omit<
  Prisma.RefundPolicyCreateManyInput,
  "semesterId"
> &
  SemesterIdentifier;

export type RefundPolicyVerification = {
  minAttend: number;
  maxAttend: number;
  type: RefundPolicy["type"];
};

export type LectureInput = {
  level: Lecture["level"];
  lectureNumber: number;
  bojGroupId: number;
} & SemesterQuery;
