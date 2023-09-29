# Jog Tracker

Jog Tracker is app build for jogger to keep track of daily progress and see aggregated statistics. The interface is clean, clear and is easy to use from the moment you first start using the app.

**Table of Contents**

- [Jog Tracker](#jog-tracker)
- [Get Started](#get-started)
  - [URLs](#urls)
  - [Database Requirement](#database-requirement)
- [Tools and Libraries Used](#tools-and-libraries-used)
- [Features](#features)
  - [Sign Up](#sign-up)
  - [Sign In](#sign-in)
  - [Dashboard](#dashboard)
  - [Jog Logs](#jog-logs)
  - [Make An Entry](#make-an-entry)
  - [Manage Users (Admin and Manager)](#manage-users-admin-and-manager)
  - [Create User (Admin and Manager)](#create-user-admin-and-manager)
  - [Manage User's Log (Admin Only)](#manage-users-log-admin-only)
- [API Documentation](#api-documentation)
- [Tests](#tests)
  - [Unit Tests - Front End](#unit-tests---front-end)
  - [Functional Tests - Back End](#functional-tests---back-end)
  - [End to End Tests](#end-to-end-tests)
- [Author](#author)

# Get Started

```bash

# setup (once)
npm install

# build
npm run build

# start
npm start

# run unit tests (make sure API is running)
npm test

# run e2e tests
npm run e2e

# run in development mode
npm run develop

# individual unit test
npm run test:server
npm run test:ui

```

## URLs

- App: [http://localhost:5000](http://localhost:5000)
- API: [http://localhost:5000/api](http://localhost:5000/api)

## Database Requirement

This setup requires an instance of MongoDB to be running in the local machine at default port. Alternatively you can configure a DB of your own - modify `conf/app-conf.prod.json` (for production) & `conf/app-conf.dev.json` (for development)

```json
{
  "database": {
    "url": "mongodb://localhost/jog-tracker"
  }
}
```

# Tools and Libraries Used

| PURPOSE               | LIBRARY                                                      |
| --------------------- | ------------------------------------------------------------ |
| View Library          | [ReactJS](https://facebook.github.io/react/)                 |
| State Management      | [StateX](https://github.com/rintoj/statex)                   |
| CSS (Functional)      | [Tachyons](http://tachyons.io/)                              |
| CSS Processor         | [SaSS](http://sass-lang.com/)                                |
| AJAX Library          | [Axios](https://github.com/mzabriskie/axios)                 |
| Transpiler            | [TypeScript](https://www.typescriptlang.org/)                |
| Packaging             | [WebPack](https://webpack.js.org/)                           |
| Database              | [MongoDB](https://www.mongodb.com/)                          |
| API Library           | [Mongo Restifier](https://github.com/rintoj/mongo-restifier) |
| Web Framework         | [Express](https://expressjs.com/)                            |
| Object DB Modeling    | [Mongoose](http://mongoosejs.com/)                           |
| Test Suites           | [Mocha](https://mochajs.org/)                                |
| Assertion Library     | [Chai](http://chaijs.com/)                                   |
| React Testing Library | [Enzyme](http://airbnb.io/enzyme/index.html)                 |
| End to End Testing    | [TestCafe](https://devexpress.github.io/testcafe/)           |
| Code Coverage         | [Istanbul](https://istanbul.js.org/)                         |

# Features

## Sign Up

![SignUp](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/signup.png)

## Sign In

![SignUp](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/signin.png)

## Dashboard

![Dashboard](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/dashboard.png)

## Jog Logs

![Jog Logs](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/logs.png)

## Make An Entry

![Make An Entry](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/make-an-entry.png)

## Manage Users (Admin and Manager)

![Manage Users](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/manage-users.png)

## Create User (Admin and Manager)

![Create User](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/create-user.png)

## Manage User's Log (Admin Only)

![Manage User's Log](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/manage-users-records.png)

# API Documentation

![API Documentation](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/api-doc.png)

# Tests

## Unit Tests - Front End

![Ui Tests](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/ui-tests.png)
![Ui Test Summary](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/test-summary.png)

## Functional Tests - Back End

![Server Tests](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/server-tests.png)

## End to End Tests

![End To End Tests](https://raw.githubusercontent.com/rintoj/jogging-tracker/master/docs/img/e2e-tests.png)

# Author

**Rinto Jose** (rintoj)

Read my blogs at [Medium.com](https://medium.com/@rintoj)

Follow me:
[Github](https://github.com/rintoj)
| [Facebook](https://www.facebook.com/rinto.jose)
| [Twitter](https://twitter.com/rintoj)
| [Google+](https://plus.google.com/+RintoJoseMankudy)
| [Youtube](https://youtube.com/+RintoJoseMankudy)
