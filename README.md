<p align="center">
  <a href="https://github.com/yufengctbu/nest-service/" target="blank"><img src="https://raw.githubusercontent.com/yufengctbu/resources/main/images/logo.png" width="96" alt="nest-service Logo" /></a>
</p>

# nest-service

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

## 简介

`nest-service` 是一款基于 `nest.js` 框架进行封装的服务端架构，它包含了服务端常用功能, 并且具有易扩展，易配置等特点

-   日志系统 (记录所有请求的详细数据以及错误的相关信息)
-   `mysql`, `redis` 数据库模块
-   注册登录功能
-   权限配置 (可根据接口动态配置)
-   验证码，邮件发送等功能
-   统一配置了数据验证机制，并且统一了数据返回格式

## 安装

```bash
$ yarn install
```

## 运行

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 测试

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

Licensed under the [MIT](/LICENSE) License.
