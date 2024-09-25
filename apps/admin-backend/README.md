# 신촌연합 알고리즘 캠프 Node.js 백엔드 프로젝트

신촌지역 대학교 프로그래밍 동아리 연합 관리자 페이지의 백엔드를 새로 만드는 중입니다.

## 개발 환경 세팅

아래 명령어를 통해 레포지토리를 클론합니다.

```bash
git clone https://github.com/icpc-sinchon/admin-service-new-backend.git
```

클론한 레포지토리로 이동한 후, 아래의 명령어를 통해 필요한 패키지를 설치합니다.

```bash
npm install
```

## 필요한 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성한 후, 아래의 환경 변수를 설정합니다. 이 값은 신촌연합 프로그램 관리팀에서 받을 수 있습니다.

```bash
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
DB_PORT=
DEV_PORT=

JWT_SECRET=
DATABASE_URL=
```

## 서버 실행

아래의 명령어를 통해 서버를 실행합니다. 이 명령어는 로컬 환경에서 서버를 실행할 때 사용합니다.

```bash
npm run dev
```

## DB 로컬 설정

로컬 DB는 docker를 통해 신촌연합에서 사용하는 DB와 동일한 구조로 설정되어 있습니다. 따라서, 로컬에서 DB를 사용하기 위해서는 docker를 설치해야 합니다. docker 설치 방법은 [도커 엔진 설치 공식 문서](https://docs.docker.com/engine/install/)를 참고해주세요.

docker를 설치한 후, 아래의 명령어를 통해 DB를 실행합니다.

```bash
docker-compose up -d
```

이렇게 하면 `localhost:3306`에서 DB가 실행됩니다. 그리고 이 상태에서 앞서 언급한 `npm run dev` 명령어를 통해 서버를 실행하면 docker 컨테이너와 서버가 연결되어 DB를 사용할 수 있습니다.

실행된 컨테이너를 확인하려면 다음 명령어를 사용합니다.

```bash
docker ps
```

docker compose로 실행된 컨테이너들을 종료하려면 다음 명령어를 사용합니다.

```bash
docker-compose down
```

로컬에서 DB가 생성되지 않았다면 다음 명령어를 이용해서 Prisma가 DB를 생성하도록 합니다.

```bash
npx prisma migrate dev --name init
```

### 트러블 슈팅

https://velog.io/@msung99/Docker-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B9%8C%EB%93%9C-%ED%94%8C%EB%9E%AB%ED%8F%BC-%ED%98%B8%ED%99%98%EC%84%B1-%EA%B4%80%EB%A0%A8-%EC%97%90%EB%9F%AC-linuxamd64

https://fienestar.tistory.com/entry/docker%EB%A1%9C-Apple-Silicon%EC%97%90%EC%84%9C-xv6-%EB%B9%8C%EB%93%9C%ED%95%98%EA%B8%B0

Mac M1 등에서 위와 같이 실행할 경우 다음과 같은 에러가 발생할 수 있다. 이 경우 DB는 제대로 작동하기 때문에 로컬 개발 환경 구성에는 문제가 없을 수 있다.

```bash
The requested image's platform (linux/arm64/v8) does not match the detected host platform (linux/amd64) and no specific platform was requested
```

GitHub Action에서 사용하는 빌드 환경과 Mac M1의 환경이 달라서 발생하는 문제이다. 이는 docker에서 Rosetta를 사용하도록 설정하는 것으로 해결할 수 있다. [docker로 Apple Silicon에서 xv6 빌드하기](https://fienestar.tistory.com/entry/docker%EB%A1%9C-Apple-Silicon%EC%97%90%EC%84%9C-xv6-%EB%B9%8C%EB%93%9C%ED%95%98%EA%B8%B0)의 Use Rosetta 설정 부분까지 보면 된다.

이 설정을 하고 나서 다시 `docker-compose up -d`를 실행하면 정상적으로 컨테이너들이 실행된다.

## mock 데이터 시딩

다음 명령어를 실행하면 mock.js에 있는 mock 데이터들이 DB에 시딩됩니다. seed.js 파일에 있는 deleteMany() 명령어에 의해서 DB에 원래 있던 데이터들은 삭제됩니다. 따라서 DB에 삭제하면 안 되는 데이터들이 있는 경우 주의해주세요.
```
npx prisma db seed
```

## 스키마 구조

스키마 구조는 `npx prisma generate` 실행시 prisma-markdown을 통해 자동으로 문서화되도록 작성되어 있습니다.

[해당 문서는 ERD.md 파일에서 확인할 수 있습니다.](./prisma/ERD.md)

이를 수정하고자 할 시 [prisma-markdown](https://github.com/samchon/prisma-markdown) 문서를 참고해 `prisma/schema.prisma` 파일의 주석을 수정해주세요.

## 서버 배포

서버 배포는 Google Cloud Platform을 사용합니다. 서버 배포는 현재 GitHub Actions를 통해 자동화되어 있습니다. 따라서, `main` 브랜치에 push를 하면 자동으로 배포가 이루어집니다.