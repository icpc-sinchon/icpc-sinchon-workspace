# ICPC Sinchon Admin Page Front-end

신촌지역 대학교 프로그래밍 동아리 연합 관리자 페이지

## 개발 환경 세팅

아래의 명령어를 통해 레포지토리를 클론한다.

```bash
git clone https://github.com/icpc-sinchon/admin-service-front.git
```

클론한 레포지토리로 이동한 후, 아래의 명령어를 통해 필요한 패키지를 설치한다.

```bash
pnpm i
```

## 개발 서버 실행

아래의 명령어를 통해 개발 서버를 실행한다.

```bash
pnpm dev
```

기본 포트는 3110으로, 개발 서버 실행시 `localhost:3110`에서 페이지를 확인해볼 수 있다.

## 백엔드와 연결

백엔드 레포지토리는 [admin-service-backend](https://github.com/icpc-sinchon/admin-service-backend)에서 확인할 수 있다.

해당 레포지토리를 클론한다.

```bash
git clone https://github.com/icpc-sinchon/admin-service-backend.git
```

의존성 설치

```bash
go mod tidy
```

서버 실행

```bash
go run main.go
```

혹은 서버를 빌드한 후 실행할 수도 있다.

```bash
go build
./main
```

이렇게 하면 localhost:4748에서 백엔드 서버가 실행된다. 그리고 [프로그램 관리팀장](https://github.com/witch-factory)에게 문의하여 `.env` 파일을 받아 프로젝트 루트에 위치시킨다. 이제 프론트엔드와 백엔드가 연결되어 동작한다.