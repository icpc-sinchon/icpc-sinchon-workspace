#!/bin/bash

# Docker Compose를 사용하여 데이터베이스 컨테이너를 시작합니다.
docker-compose -f docker-compose.test.yml up -d

npm run migrate:test

# 테스트를 실행합니다.
npx vitest

# 테스트가 끝난 후 데이터베이스 컨테이너를 중지하고 제거합니다.
docker-compose -f docker-compose.test.yml down
