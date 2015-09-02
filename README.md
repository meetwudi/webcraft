# WebCraft

开发中

### 运行环境

io.js~3.3.0

### 数据库migration

数据库migration配置文件为`database.json`，使用[node-db-migrate](https://github.com/db-migrate/node-db-migrate)工具来进行migration管理。

在运行migration的时候，需要加载环境变量。应用的环境变量被存储在`.env`文件下，我们需要用[dotenv](https://github.com/motdotla/dotenv)的preload功能将其加载给`db-migrate`使用。

```
node -r dotenv/config $(where db-migrate) up -e dev
```
