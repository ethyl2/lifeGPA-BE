# Life GPA

Back end documentation: https://documenter.getpostman.com/view/9937137/T17AiVxT?version=latest

---

This is my implementation of a back end for a project from a previous Build Week at Lambda School.

During the Build Week, my assignment was to build the marketing page and about page, which can be found here:
https://lifegpa-bw.github.io/heather-ui/index.html

Now I am in the process of creating a custom back end for this project.

## Tech Stack:

Node.js | Express | knex | Sqlite3 | PostgreSQL

General:

- [Node.js](https://nodejs.org/en/) backend.
- [Express](https://expressjs.com/) framework for the API.

Security:

- [CORS](https://www.npmjs.com/package/cors) for Cross-Origin configuration.
- [helmet](https://www.npmjs.com/package/helmet) for basic security adjustments to the server. It helps secure the app by setting certain HTTP headers.
- [bcrypt](https://www.npmjs.com/package/bcrypt) for encrypting/hashing sensitive user data.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for encoding/decoding/validating JWTs (JSON web tokens).

Testing:

- [jest](https://www.npmjs.com/package/jest)
- [supertest](https://www.npmjs.com/package/supertest)

Database:

- [knex](https://www.npmjs.com/package/knex) as the query builder and interface to sqlite3/postgres.
- [sqlite3](https://www.npmjs.com/package/sqlite3) Sqlite3, used for development
- [pg](https://www.npmjs.com/package/pg) PostgreSQL

In the future, I hope to create a custom front end as well.

## The Pitch

If you gave your life a grade right now what would it be?

How would you rank your combined efforts in all your different life categories like personal development, professional goals, physical fitness, AND relationship building?

There are so many productivity and habit tracking apps out there to measure progress in one area or another, but nothing that measures your overall life with a single metric until now. Meet LifeGPA. An app designed to summarize your life’s most important efforts into a simple composite number.

---

Users can:

- Register
- Login
- Add goals they want to track, either picking from the list of pre-existing goals, or adding new goals
- Tell the app which goals they accomplished each day
- Update/delete their goals or account

App will:

- Organize goals according to category
- Show percentages of times a goal has been accomplished over a given time period
- Calculate an average percentage for a given category
- Calculate an average percentage overall

---

## To get the server running locally:

1. Clone this repo
2. To install all required dependencies:

```bash
$ npm i
```

3. Add environmental variables to .env file: PORT and JWT_SECRET

4. To start the local server:

```bash
$ npm run server
```

To run tests using the testing environment:

```bash
$ npm run test
```
