FROM node:14
WORKDIR /home/ubuntu/node
COPY package*.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build
CMD ["yarn", "start"]
EXPOSE 3100
