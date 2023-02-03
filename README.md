# contacts-api

## Installation

clone this repo

```shell
git clone https://github.com/SlimGee/contacts-api.git
```

cd into the newly created directory and install the dependencies

```shell
yarn install
```

migrate the database

```shell
node ace migration:run
```

seed the database for fake data

```shell
node ace db:seed
```


finally run the dev server

```shell
node ace serve --watch
```

## docs

find the API documentation at https://documenter.getpostman.com/view/12329212/2s935mskGw

## Testing

```shell
node ace test
```
