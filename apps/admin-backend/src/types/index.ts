import {
  RefundPolicy,
  Lecture,
  Semester,
  Student,
  Prisma,
} from "@prisma/client";

export type EmptyObject = Record<string, never>;

export interface BojLoginCredentials {
  boj_id: string;
  boj_pw: string;
}

export interface SemesterQuery {
  year: string;
  season: Semester['season'];
}

export interface SemesterIdentifier {
  year: Semester['year'];
  season: Semester['season'];
}

export interface LectureQuery {
  year: string;
  season: Semester['season'];
  lectureLevel: Lecture['level'];
}

export interface LectureIdentifier {
  year: Semester['year'];
  season: Semester['season'];
  level: Lecture['level'];
}

export interface StudentPatchBody extends LectureQuery {
  attendLog: StudentAttendance['attendLog'];
}

export interface NewStudent {
  name: string;
  bojHandle: string;
  email: string;
  phone: string;
  school: Student['school'];
  studentNumber: string;
  paymentStatus: Student['paymentStatus'];
  refundAccount: string;
  lectureInfo: LectureIdentifier;
}

export interface StudentAttendance {
  studentId: number;
  lectureId: number;
  name: string;
  bojHandle?: string;
  refundAccount?: string;
  refundAmount?: number;
  paymentStatus: Student['paymentStatus'];
  attendLog: Array<{
    round: number;
    lectureDone: boolean;
    taskDone: boolean;
  }>;
}

export interface RefundPolicyInput
  extends Omit<Prisma.RefundPolicyCreateManyInput, 'semesterId'>,
    SemesterIdentifier {}

export interface RefundPolicyVerification {
  minAttend: number;
  maxAttend: number;
  type: RefundPolicy['type'];
}

export interface LectureInput extends SemesterQuery {
  level: Lecture['level'];
  lectureNumber: number;
  bojGroupId: number;
}
