import dotenv from 'dotenv';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

// .env 파일의 절대 경로 지정
dotenv.config({ path: resolve('src', '.env') });

// 환경 변수 출력 확인 (디버깅 용)
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const command = `set DATABASE_URL=${process.env.DATABASE_URL} && npx prisma migrate dev`;
execSync(command, { stdio: 'inherit' });