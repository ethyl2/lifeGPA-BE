const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const UsersRouter = require('../users/usersRouter.js');
const GoalsRouter = require('../goals/goalsRouter.js');
const CategoriesRouter = require('../categories/categoriesRouter.js');
const ConnectionsRouter = require('../connections/connectionsRouter.js');
const SuccessesRouter = require('../successes/successesRouter.js');
const GpaRouter = require('../gpa/gpaRouter.js');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(morgan('tiny'));
server.use(cors());
server.use('/api/users', UsersRouter);
server.use('/api/goals', GoalsRouter);
server.use('/api/categories', CategoriesRouter);
server.use('/api/connections', ConnectionsRouter);
server.use('/api/successes', SuccessesRouter);
server.use('/api/gpa', GpaRouter);

server.get('/api', (req, res) => {
  res.status(200).json({
    message: `API is up and running. 🏃‍♀️`,
  });
});
module.exports = server;
