export type Admin = {
  id: number;
  username: string;
  password: string;
};

export type School = "YONSEI" | "SOGANG" | "HONGIK" | "EWHA" | "SOOKMYUNG";

export type Payment = "PAID_30000" | "PAID_60000";

export type Level = "Novice" | "Intermediate" | "Advanced";

export type Season = "Summer" | "Winter";

export type Student = {
  id: number;
  name: string;
  bojHandle: string;
  email: string;
  phone: string;
  studentNumber: string; // 학번
  school: School;
  paymentStatus: Payment;
  refundAccount: string;
  lectureLevels: Level[];
};

export type NewStudent = {
  name: string;
  bojHandle: string;
  email: string;
  phone: string;
  school: Student["school"];
  studentNumber: string;
  paymentStatus: Student["paymentStatus"];
  refundAccount: string;
  lectureInfo: {
    year: number;
    season: Season;
    level: Level;
  };
};

// TODO: 모노레포 등으로 타입 통합하기
export type StudentAttendance = {
  studentId: number;
  lectureId: number;
  name: string;
  bojHandle: string;
  refundAmount: number; // 환급 금액
  refundAccount: string; // 환급 계좌
  attendLog: {
    round: number;
    lectureDone: boolean;
    taskDone: boolean;
  }[];
};

export type FormattedAttendance = {
  studentId: number;
  lectureId: number;
  bojHandle: string;
  attendLog: { round: number; lectureDone: string; taskDone: string }[];
  lectureRefund: boolean;
  taskRefund: boolean;
};
