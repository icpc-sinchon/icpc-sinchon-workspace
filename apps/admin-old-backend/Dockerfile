# Node.js 공식 이미지를 기반으로 설정
FROM node:20

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 앱 소스 추가
COPY . .

# 애플리케이션 의존성 설치
# package.json 과 package-lock.json을 복사
COPY package*.json /usr/src/app

RUN npm install
# 프로덕션을 위한 코드라면
# RUN npm ci --only=production

# 앱이 사용할 포트를 노출
EXPOSE 8080

CMD ["npm", "run", "start"]

# # wait-for-it 스크립트 추가
# ADD https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh /usr/wait-for-it.sh
# RUN chmod +x /usr/wait-for-it.sh

# # 실행 명령 수정
# CMD ["/bin/sh", "-c", "/usr/wait-for-it.sh ${DB_HOST}:${DB_PORT} -- npx prisma migrate deploy && npm run start"]
