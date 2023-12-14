FROM node:18.17.0-alpine

# 设置变量
ENV APP_PATH=/nest-service

WORKDIR $APP_PATH

EXPOSE 3000

COPY package.json ./

# 安装node项目依赖, 如果需要编译，如ts编译等可以在这个阶段完成
RUN yarn config set registry 'https://mirrors.cloud.tencent.com/npm/' && yarn

# 将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入镜像的工作目录下
COPY . .

RUN yarn build

CMD yarn start:prod
