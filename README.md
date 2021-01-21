# Приложение доставки еды | Delivery Food APP

## RESTful API

`Данное приложение` является RESTful Api сервером построенное на платформе `Node.js` и реймворка `Exspress`. Для хранения данных используется база данных `PostgreSQL`.
****
`This application` is REST API server implementation built on top `Node.js` platform and `Express` framework. The app use `PostgreSQL` data base for storage data. 

## Запуск проекта | Running project

## Руководство | Manual

Вам необходимо установить [Node.js](https://nodejs.org) и [PostgreSQL](https://www.postgresql.org/).
****
You need to have [Node.js](https://nodejs.org) and [PostgreSQL](https://www.postgresql.org/) installed.

### Инициализзация базы данных | Data base initialisation

```sh
npm run init_db
```

### Запуск сервера | Run server

```sh
npm start
```

## Сборка проекта | Project building

Для размещения на удаленом сервере необходимо собрать проект.
****
You need to build project for deploy in the remote server.

</br>

Переименовываем | Rename 
```
.env.example -> .env
```

Подготовить переменные окружения в файле `.env`.
****
You need to setup a environment variables in `.env` file.

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

Сборка | Building

```sh
./build.sh
```

## Docker

Вам необходимо установить [Docker](https://docs.docker.com/engine/install/) и [Docker-Compose](https://docs.docker.com/compose/install/).
****
You need to have [Docker](https://www.docker.com/community-edition) and [Docker-Compose](https://docs.docker.com/compose/install/) installed.

### Сборка контейнера | Container building

```sh
docker-compose build
```

### Запуск сервера | Run server

```sh
docker-compose up
```

## Тесты | Tests

```sh
npm test
```

## Используемые модули | Modules used

Некоторые используемые модули:
****
Some of non-standard modules used:

* [express](https://www.npmjs.com/package/express)
* [pg](https://www.npmjs.com/package/pg)
* [multer](https://www.npmjs.com/package/multer)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [dotenv](https://www.npmjs.com/package/dotenv)

Модули для тестирования:
****
Test modules:

* [jest](https://www.npmjs.com/package/jest)

## Автор | Author
Создано и поддерживается [Katala121](https://github.com/Katala121).
****
Created and maintained by [Katala121](https://github.com/Katala121).

## Лицензия | License

`Delivery_food` доступен под лицензией ISC.
****
`Delivery_food` is available under the ISC license.
