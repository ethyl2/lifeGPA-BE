const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const UsersRouter = require('../users/usersRouter.js');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(morgan('tiny'));
server.use(cors());
server.use('/api/users', UsersRouter);

module.exports = server;
