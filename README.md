# Backend-postgre
  This is a pet project of full stack js/ts application which consist of 3 linked services:
  - a database backend service (this repo)
  - [Admin service](https://github.com/Wellonly/ra-frontend) powered by [React-Admin](https://github.com/marmelab/react-admin)
  - [Storefront service](https://github.com/Wellonly/gatsby-store) powered by [Gatsby](https://github.com/gatsbyjs/gatsby)

## Features of Client + Server

* React (create-react-app) with Apollo Client
  * Queries, Mutations, Subscriptions
* Node.js with Express and Apollo Server
  * cursor-based Pagination
* PostgreSQL Database with Sequelize
  * entities: users, messages, etc
* Authentication
  * Sign Up, Sign In, Sign Out
* Authorization
  * protected endpoint (e.g. verify valid session)
  * protected resolvers (e.g. e.g. session-based, role-based)
  * protected routes (e.g. session-based, role-based)
* performance optimizations
  * example of using Facebook's dataloader
* E2E testing

### .env file

Since this project is using PostgreSQL, you have to install it for your machine and get a database up and running. After you have created a database and a database user, you can fill out the environment variables in the *.env* file.

```
PORT=8001
DATABASE=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=example
DATABASE_HOST=dock
DATABASE_PORT=5432
DATABASE_SCHEMA=public
SECRET=lkjsdfgm56l8fds8fghs8y7dfghs908qpka

```

The `SECRET` is just a random string for your authentication. Keep all these information secure by adding the *.env* file to your *.gitignore* file. No third-party should have access to this information.

#### Testing

* adjust `test:run-server` npm script with `TEST_DATABASE` environment variable in package.json to match your testing database name
* one terminal: npm run test:run-server
* second terminal: npm run test:execute-test with psql

MIT License Copyright (c) 2023 Well <github.com/Wellonly>