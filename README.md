<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ankurksoni_dockerised-nest-app&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ankurksoni_dockerised-nest-app)

## Description

We used,
1. [Nest](https://github.com/nestjs/nest) framework,"Nest js" boilerplate ready with schema entity connected and running end-to-end with Postgres docker container.
2. `Dockerfile` with best practice like HEALTHCHECK, multi-stage etc. to be deployed on production.
3. `docker-compose.yml` file to start containers in most hassle-free way.
4. Docker containers enriched with "PM2" capabilities, Healthchecks, etc. 
5. We have provided the `insomnia API`(`Insomnia_APIs.json`) list for you to try it out at your end.

## Pre-requisite

Make sure you have docker, jq, curl, latest node.js engine etc installed.

## Manual Installation

```bash
$ git clone https://github.com/ankurksoni/dockerised-nest-app.git
$ cd dockerised-nest-app
$ yarn install --frozen-lockfile
$ yarn run build
```

## Running the app: "docker-compose.yml" way

* Make sure you have docker installed [Non root]
* Just goto the project folder `dockerised-nest-app` and run `docker-compose up -d`
* Then run `docker ps` and status column must show **(healthy)** signs.
* Try running a curl command as below,

    * CHECK HEALTH : `curl --request GET --url http://localhost:3000/health --header 'Content-Type: application/json'`
    * CREATE COFFEE ITEM: `curl --request POST --url http://localhost:3000/coffees --header 'Content-Type: application/json' --data '{"name": "random 123", "brand": "buddy brew", "flavor": ["orange", "mango"]}'`
    * GET ALL ITEMS: `curl --request GET --url http://localhost:3000/coffees --header 'Content-Type: application/json'`
    * GET SPECIFIC ITEM: `curl --request GET --url http://localhost:3000/coffees/1 --header 'Content-Type: application/json'`
    * DELETE ITEM: `curl --request DELETE --url http://localhost:3000/coffees/1 --header 'Content-Type: application/json'`
* To restart as fresh container run below command,

    * `docker rmi $(docker images -f "dangling=true" -q); docker system prune; docker build -t nest-cloud-run --no-cache .`
* To debug the health situation for a process in docker container,
    * `docker inspect --format "{{json .State.Health }}" dockerised-nest-app_nest-app_1 | jq`

* To shut down and remove docker container,
    * `docker-compose down`

## Running the app: Manually

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Stay in touch

- Author - Ankur Soni
- Linkedin - [https://www.linkedin.com/in/ankur-s-442143161/](https://www.linkedin.com/in/ankur-s-442143161/)
- Stackoverflow - [https://stackoverflow.com/users/3296607/ankur-soni](https://stackoverflow.com/users/3296607/ankur-soni)