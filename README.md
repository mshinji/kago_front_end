# Docker on DATABASE_NEO

## 前準備(初回だけ実行)

```
$ docker network create shared-network
$ docker-compose build
$ docker-compose run web yarn install
```

## 確認

```
$ docker-compose up
http://localhost:3000 にアクセス
```
