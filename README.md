# lorem314.io-v27

## MDX

### blog

```txt
---
title: "title"
tags: ["tag1", "tag2"]
createdAt: "2026-01-01"
type: "post" | "scrollycoding"
summary: "summary"
---
```

### book cover

```json
{
  "isbn": "",
  "title": "",
  "subtitle": ""
}
```

### book chapter

```txt
---
isbn: "978-1-492-07729-9"
title: "为何采用分布式"
chapter: 1
---
```

## Docker

共有三个 yml 配置文件：

- `docker-compose.yml`：基础配置
- `docker-compose.override.yml`：开发用额外配置。如关闭安全模式
- `docker-compose.prod.yml`：生产环境专用配置。如 tls 证书和禁用 kibana

### 开发

docker 会自动加载 override 文件。

```shell
docker compose up -d
```

### 生产

```shell
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
