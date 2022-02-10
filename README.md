# Hardhat Template

This is a github template repository to build projects upon. Initialising hardhat projects with the template saves on hardhat setup, configuring plugins. It's packed with all the mainly required setup. bonus: a github workflow for running tests on push

## Steps

-   Clone

```sh
git clone https://github.com/nonceblox/hardhat-template.git
```

-   Install dependencies

```sh
cd hardhat-template && npm i
```

-   Setup .env

the `.env.example` file is a reference for setting up .env

```sh
cp .env.example .env
```

and populate the env variables

## Tasks

-   Test

```sh
npm test
```

-   Test Coverage

```sh
npm run coverage
```
