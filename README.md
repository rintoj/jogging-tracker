# Jog Tracker

Jog Tracker is app build for jogger to keep track of daily progress and see aggregated statistics. The interface is clean, clear and is easy to use from the moment you first start using the app.

**Table of Contents**

- [Get Started](#get-started)
- [URLs](#urls)
- [Database Requirement](#database-requirement)
- [Features](#features)
  - [Sign Up](#sign-up)
  - [Sign In](#sign-in)
  - [Dashboard](#dashboard)
  - [Jog Logs](#jog-logs)
  - [Make An Entry](#make-an-entry)
  - [Manage Users (Admin & Manager)](#manage-users-admin--manager)
  - [Create User (Admin & Manager)](#create-user-admin--manager)
  - [Manage User's Log (Admin Only)](#manage-users-log-admin-only)
- [API Documentation](#api-documentation)
- [Tools & Libraries](#tools--libraries)
- [Unit Tests - Front End](#unit-tests---front-end)
- [Functional Tests - Back End](#functional-tests---back-end)
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

# URLs

- App: [http://localhost:5000](http://localhost:5000)
- API: [http://localhost:5000/api](http://localhost:5000/api)

# Database Requirement

This setup requires an instance of MongoDB to be running in the local machine at default port. Alternatively you can configure a DB of your own - modify `conf/app-conf.prod.json` (for production) &  `conf/app-conf.dev.json` (for development)

```json
{
  "database": {
    "url": "mongodb://localhost/jog-tracker"
  }
}
```

# Features

## Sign Up

![SignUp](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/signup.png)

## Sign In

![SignUp](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/signin.png)

## Dashboard

![Dashboard](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/dashboard.png)

## Jog Logs

![Jog Logs](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/logs.png)

## Make An Entry

![Make An Entry](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/make-an-entry.png)

## Manage Users (Admin & Manager)

![Manage Users](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/manage-users.png)

## Create User (Admin & Manager)

![Create User](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/create-user.png)

## Manage User's Log (Admin Only)

![Manage User's Log](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/manage-users-records.png)

# API Documentation

![API Documentation](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/api-doc.png)

# Tools & Libraries

| PURPOSE      | LIBRARY
|--------------|-----------------------------------------------
| View Library | [ReactJS](https://facebook.github.io/react/) |
| State Management | [StateX](https://github.com/rintoj/statex) |
| CSS (Functional) | [Tachyons](http://tachyons.io/) |
| CSS Processor | [SaSS](http://sass-lang.com/) |
| AJAX Library | [Axios](https://github.com/mzabriskie/axios) |
| Transpiler | [TypeScript](https://www.typescriptlang.org/) |
| Packaging | [WebPack](https://webpack.js.org/) |
| Database | [MongoDB](https://www.mongodb.com/) |
| API Library | [Mongo Restifier](https://github.com/rintoj/mongo-restifier) |
| Web Framework | [Express](https://expressjs.com/) |
| Object DB Modeling | [Mongoose](http://mongoosejs.com/) |
| Test Suites | [Mocha](https://mochajs.org/) |
| Assertion Library | [Chai](http://chaijs.com/) & [Enzyme](http://airbnb.io/enzyme/index.html) |
| Code Coverage | [Istanbul](https://istanbul.js.org/) |

# Unit Tests - Front End

![Ui Tests](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/ui-tests.png)
![Ui Test Summary](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/test-summary.png)

# Functional Tests - Back End

![Server Tests](http://git.toptal.com/Rinto-Jose/rinto-jose/raw/master/docs/img/server-tests.png)

# Author

**Rinto Jose** (rintoj)

Read my blogs at [Medium.com](https://medium.com/@rintoj)

Follow me:
  [Github](https://github.com/rintoj)
| [Facebook](https://www.facebook.com/rinto.jose)
| [Twitter](https://twitter.com/rintoj)
| [Google+](https://plus.google.com/+RintoJoseMankudy)
| [Youtube](https://youtube.com/+RintoJoseMankudy)