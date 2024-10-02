export type Semester = {
  id: number;
  year: number;
  season: "Summer" | "Winter";
  lectures?: Lecture[];
};

export type Lecture = {
  id: number;
  level: "Novice" | "Intermediate" | "Advanced";
  lectureNumber: number;
  bojGroupId: number;
  task: Task[];
};

export type Task = {
  id: number;
  lectureId: number;
  // 회차
  round: number;
  practiceId: number;
  // 출석 인정을 위해 풀어야 하는 최소 문제 개수
  minSolveCount: number;
  problems: BOJProblem[];
};

export type BOJProblem = {
  id: number;
  taskId: number;
  // 백준 온라인 저지 문제 번호
  bojProblemNumber: number;
  essential: boolean;
};
