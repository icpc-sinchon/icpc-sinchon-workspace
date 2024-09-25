# 현재 필요한 API 정리

- 클라이언트는 현재 기준으로 늘 currentSemester를 가지고 있다.

# 학생 관리 페이지

/student GET
- year, season 쿼리를 받아서 해당 semester 강의를 듣는 학생과 학생들이 해당 학기에 듣는 강의 정보 배열(`["Novice"]`처럼) 반환
- StudentLectureService.findStudentsWithLectureLevelsBySemester로 구현

StudentLectureService에서는 학생 목록 with lecture log를 받아서 학생 목록과 각 학생이 듣는 강의 정보로 포매팅해 반환한다
원시 데이터를 가져오는 로직은 StudentLectureRepository에서 구현

/student/:studentId GET
- 학생과 학생이 이번 학기에 듣는 강의 난이도 정보들 반환
- 현재는 쓰이고 있지 않음

POST /student
- 학생 추가
- 학생 정보와 year, season, 학생이 들을 강의 난이도인 level을 받는다
- 이때 학생의 정보뿐 아니라 학생이 듣는 강의정보인 studentLectureLog도 함께 추가
- StudentLectureService.createStudentWithLectureLog로 구현
- TODO: 이때 학생이 수강해야 할 강의가 이미 있는지 확인하는 로직 필요

/student/multiple POST
- 학생 여러 명 추가
- 학생 정보와 year, season, 학생이 들을 강의 난이도인 level이 담긴 배열을 받는다
- StudentLectureService.createStudentsWithLectureLog로 구현
- TODO: 위와 같이 이때 추가하는 학생이 수강해야 할 하는 강의가 이미 있는지 확인하는 로직 필요

/student/:studentId PATCH
- 학생 정보 수정
- StudentUpdateInput을 받는다
- studentService.updateStudent로 구현
- **수강 강의 난이도 정보 편집은 추후에 개발**

/student/:studentId DELETE
- 학생 ID를 받아서 해당 학생 삭제
- studentService.deleteStudent로 구현

학생 추가는 post로 한다.

# 출석 관리 페이지

/student-attendance GET
- year, season, level 쿼리를 받아서 해당 강의의 학생들의 출석 정보를 반환
- 현재 학기에 강의를 듣는 학생들의 정보만 반환한다
- 여기에 환급 조건에 따라 환급 계산도 되어야 함
- studentAttendService.findAllStudentsAttendLogs 구현

/student-attendance PATCH
- studentId(parameter로 받음), year, season, level, attendLog(taskDone, lectureDone, round를 포함) 쿼리를 받아서 해당 학생의 출석 정보를 1~n회차 수정

# 설정 페이지

/semester GET
- 모든 존재하는 학기의 정보를 반환
- SemesterRepository.allSemesters

/lecture GET
- year, season 쿼리를 받아서 해당 학기의 강의 정보들을 반환. 이때 각 강의의 task+problem 정보도 함께 반환한다
- LectureRepository.findLecturesWithTasksBySemester

/lecture POST
- year, season과 추가할 강의의 정보(level, lectureNumber, bojGroupId)를 받아서 강의 추가
- 이때 lectureNumber 만큼의 task 정보도 함께 추가

/lecture/:lectureId PATCH
- 강의 정보 수정
- 수정할 강의 ID와 update할 강의 정보를 body로 받아서 강의 정보 수정

/lecture/:lectureId DELETE
- 강의 ID를 받아서 해당 강의 삭제

**task 생성은 강의 생성 시 함께 이루어지도록 짜여 있다**

/task/:taskId PATCH
- task 정보 수정
- 수정할 task ID와 update할 task 정보를 body로 받아서 task 정보 수정
- minSolveCount, practiceId는 그대로 수정한다
- problems는 task에 속한 문제들의 BOJ 번호 배열인데 매번 전부 삭제하고 다시 생성한다

/refund GET
- year, season 쿼리를 받아서 해당 학기의 환급 조건 정보를 반환

/refund POST
- year, season과 추가할 환급 조건 정보를 받아서 환급 조건 추가
- 기존 환급 조건과 겹치는지 확인 로직 백엔드에서 필요

/refund/:refundPolicyId PATCH
- 수정할 환급 조건 정보를 받아서 환급 조건 수정
- 이것도 기존 환급 조건과 겹치는지 확인 로직 필요

/refund/:refundPolicyId DELETE
- 환급 조건 ID를 받아서 해당 환급 조건 삭제

이외의 /auth/login, /auth/logout, /auth/register, /auth/check은 현재 구현대로 쓰면 된다.

현재 학기 변경은 JSON을 통해 처리 중

**환급 조건 계산하는 로직 구현/ 지금 있는 거 개선 필요**

# BOJ 스크래핑

일단 BOJ 로그인 요청 -> 강의의 연습 ID 설정 -> 강의의 문제들을 스크래핑해서 DB에 저장

# 서비스 설계

