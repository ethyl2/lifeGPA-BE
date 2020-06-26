const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const UsersRouter = require('../users/usersRouter.js');
const GoalsRouter = require('../goals/goalsRouter.js');
const CategoriesRouter = require('../categories/categoriesRouter.js');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(morgan('tiny'));
server.use(cors());
server.use('/api/users', UsersRouter);
server.use('/api/goals', GoalsRouter);
server.use('/api/categories', CategoriesRouter);

module.exports = server;
