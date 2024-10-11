#!/bin/bash

# Docker Compose로 컨테이너 실행
docker-compose -f docker-compose.test.yml up -d

# 데이터베이스가 준비될 때까지 대기
./bin/wait-for-it.sh localhost:3307 -t 60

# 데이터베이스가 준비되면 마이그레이션 실행
npm run migrate:test

# 테스트 실행
npm run test

# 테스트 완료 후 컨테이너 종료
docker-compose -f docker-compose.test.yml down