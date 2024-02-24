# RUCores

## Setup 🛠

Use the following commands from the **root** of the repo:

```bash
npm i # install all packages
npm start # start the front and backend
npm run lint # show but not fix
npm run lint:fix # show and attempt to fix automatically
npm run format # fix formatting
npm run format:check # check formatting but not fix
```

### Install Node.js

You will need to have Node.js installed on your machine. You can download it [here](https://nodejs.org/en/).

### Install MySQL

You can download MySQL [here](https://dev.mysql.com/downloads/installer/)


## Developing 🚀

### MySQL

Requires a MySQL database to be running.

In order to configure the backend, create a `.env` file in the `backend` directory based on the `.env.example` file.

### VS Code

Open the extensions page and type @recommended to see a list of the recommended extensions

Type command shift P and type format to select prettier 

### Linting

The repo is setup with linting, specifically with [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)
To enable linting in your editor, you may need to install the ESLint and Prettier extensions.
There are also pre-commit hooks setup to run linting before a commit is made. You will need to fix these issues before making a commit.
You can also manually run linting with the following command:

```bash
npm run lint # show but not fix
npm run lint:fix # show and attempt to fix automatically
npm run format # fix formatting
npm run format:check # check formatting
```

### Git Hooks

This repo is setup with git hooks using [Husky](https://typicode.github.io/husky/#/) and [Lint-Staged](https://github.com/lint-staged/lint-staged).

Any time a commit is made, all files will be linted and formatted. If there are any issues, the commit will be rejected.


