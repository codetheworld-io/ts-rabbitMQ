# ts-rabbitMQ

Source code for [Handle Tasks Asynchronously: Web Push Notification System With RabbitMQ](https://hoangdv.medium.com/handle-tasks-asynchronously-web-push-notification-system-with-rabbitmq-dabab19d4652)

## Develop

### Start mongo service with Docker Compose

```shell
docker-compose up -d
```

### Install dependencies

```shell
npm ci
```

### Start dev server

```shell
npm run dev
```

### Start consumer

```shell
# In a new terminal window
node ./dist/RabbitMQConsumer.js
```
