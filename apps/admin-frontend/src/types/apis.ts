const ROUTE_URLS = {
  AUTH: "/auth",
  STUDENT: "/student",
  STUDENT_LECTURE: "/student-lecture",
  STUDENT_LECTURE_LOG: "/student-lecture-log",
  STUDENT_ATTENDANCE: "/student-attend",
  SEMESTER: "/semester",
  LECTURE: "/lecture",
  TASK: "/task",
  REFUND: "/refund-policy",
  BOJ: "/boj-scrap",
} as const;

export const API_URL = {
  CONFIG: "/config",
  AUTH: {
    BASE: ROUTE_URLS.AUTH,
    CHECK: `${ROUTE_URLS.AUTH}/check`,
    LOGIN: `${ROUTE_URLS.AUTH}/login`,
    REGISTER: `${ROUTE_URLS.AUTH}/register`,
    LOGOUT: `${ROUTE_URLS.AUTH}/logout`,
  },
  STUDENT: {
    BASE: ROUTE_URLS.STUDENT,
    MULTIPLE: `${ROUTE_URLS.STUDENT}/multiple`,
    byId: (id: number | string) => `${ROUTE_URLS.STUDENT}/${id}`,
  },
  STUDENT_LECTURE_LOG: {
    BASE: ROUTE_URLS.STUDENT_LECTURE_LOG,
    MULTIPLE: `${ROUTE_URLS.STUDENT_LECTURE_LOG}/multiple`,
    byId: (id: number | string) => `${ROUTE_URLS.STUDENT_LECTURE_LOG}/${id}`,
  },
  STUDENT_LECTURE: {
    BASE: ROUTE_URLS.STUDENT_LECTURE,
    MULTIPLE: `${ROUTE_URLS.STUDENT_LECTURE}/multiple`,
  },
  STUDENT_ATTENDANCE: {
    BASE: ROUTE_URLS.STUDENT_ATTENDANCE,
    MULTIPLE: `${ROUTE_URLS.STUDENT_ATTENDANCE}/multiple`,
    BOJ: `${ROUTE_URLS.STUDENT_ATTENDANCE}/boj`,
    byStudentId: (studentId: number | string) =>
      `${ROUTE_URLS.STUDENT_ATTENDANCE}/${studentId}`,
  },
  SEMESTER: {
    BASE: ROUTE_URLS.SEMESTER,
  },
  LECTURE: {
    BASE: ROUTE_URLS.LECTURE,
    byId: (id: number | string) => `${ROUTE_URLS.LECTURE}/${id}`,
  },
  TASK: {
    BASE: ROUTE_URLS.TASK,
    byId: (id: number | string) => `${ROUTE_URLS.TASK}/${id}`,
  },
  REFUND: {
    BASE: ROUTE_URLS.REFUND,
    byId: (id: number | string) => `${ROUTE_URLS.REFUND}/${id}`,
  },
  BOJ: {
    BASE: ROUTE_URLS.BOJ,
    LOGIN: `${ROUTE_URLS.BOJ}/login`,
    SCRAP: `${ROUTE_URLS.BOJ}/scrap`,
    ATTENDANCE: `${ROUTE_URLS.BOJ}/attendance`,
  },
} as const;
