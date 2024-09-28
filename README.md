# ICPC Sinchon Workspace

이 레포지토리는 pnpm workspace를 사용한 모노레포 프로젝트입니다. 관리자 페이지의 프론트엔드와 백엔드, 랜딩 페이지, 그리고 공유 라이브러리를 포함하고 있습니다.

## 프로젝트 구조

```shell
my-monorepo/
├── apps/
│   ├── admin-frontend/
│   ├── admin-backend/
│   └── homepage/
├── libs/
│   └── shared/
├── pnpm-workspace.yaml
└── package.json
└── ...
```

`apps/`: 관리자 페이지 프론트엔드, 백엔드, 랜딩 페이지 등의 애플리케이션

`libs/`: 공유 라이브러리

## 설치

이 프로젝트는 pnpm을 사용합니다. 다음 명령어로 의존성을 설치하세요:

```shell
pnpm install
```

## 협업 내용

팀원
- [김성현](https://github.com/witch-factory)
- [신정화](https://github.com/jungh150)

### 규칙

- 회의
  - 정기 회의: 매주 월요일 23시, 대면 진행시 저녁 시간대
  - 매주 수요일, 토요일 18시 이후 저녁에 간단히 카톡으로 상황 공유

- 의사소통
  - 의견을 자유롭게 공유하고 상호 피드백 활발히 주고받기
  - 상대방 의견 경청하기
  - 부정적인 피드백 이전에 칭찬으로 시작하기
  - 읽씹하지 않기
  - 연락 잘 보기
  - 연락을 하루 이상 보지 못할 바쁜 일이 있을 시 미리 이야기하기
  - 회의 시작과 정기 상황공유 이전에 TMI 하나씩 말하기

### 커밋 규칙

커밋 메시지 말머리 목록
- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 수정
- style: UI 스타일 관련 수정사항
- refactor: 코드 리팩토링
- test : 테스트 코드 추가
- dep: 의존성 관련 작업
- minor: 코드 포매팅 등 동작에 영향을 주지 않는 사소한 수정사항

커밋 메시지 제목은 50자 이내로 권장
부가적인 설명이 필요할 경우 한 줄 띄워서 대시(-) 하나 붙이고 작성

예시
```
feat: 로그인 기능 추가
- jsonwebtoken 라이브러리 사용
```

템플릿이 `.github/.gitmessage.txt`에 있으니 이 커맨드로 설정하면 편하게 쓸 수 있다.

```shell
git config commit.template .github/.gitmessage.txt
```

### 브랜치 전략

- main: 배포 버전
- develop: 개발 버전
- feature/기능이름(영문): 새로운 기능 개발
- fix/버그 간략설명(영문): 버그 수정
  - 엄청 자세한 설명이라기보다는 대충 어떤 페이지나 기능에서 에러가 발생했는지 정도만 써도 됨. fix/login-page-error나 fix/deploy-error 처럼 간략히 쓴다.

### PR 규칙

PR은 기본적으로 dev로 하고 main으로 머지할 때는 hotfix를 제외하면 꼭 둘이 논의 후 머지

웬만하면 PR에 개발한 기능에 유닛 테스트를 같이 작성하자(`__tests__` 폴더에 있음)

PR 메시지 포맷은 만들어 놓은 걸로

PR 제목에도 커밋 제목처럼 말머리를 붙이기
