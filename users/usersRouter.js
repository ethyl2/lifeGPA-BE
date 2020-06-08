const express = require('express');
const Users = require('./usersModel.js');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const restricted = require('../auth/authMiddleware.js');
require('dotenv').config();

router.get('/', (req, res) => {
  res.status(200).send('Welcome to the Users Router! 🐣');
});

router.get('/all', restricted, (req, res) => {
  Users.getUsers()
    .then((users) => {
      const usersList = users.map((user) => {
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
        };
      });
      res.status(200).json(usersList);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: 'Failed to retrieve users',
      });
    });
});

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;
  Users.addUser(user)
    .then((added_user) => {
      const user_to_return = {
        id: added_user.id,
        username: added_user.username,
        name: added_user.name,
        email: added_user.email,
      };
      res.status(201).json(user_to_return);
    })
    .catch((err) => {
      res.status(500).json({ error: err, message: 'Failure to add new user.' });
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        const user_to_return = {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
        };
        res.status(200).json({
          message: `Welcome, ${user.name}`,
          status: 'Logged in',
          token: token,
          user_info: user_to_return,
        });
      } else {
        res.status(401).json({
          error: 'invalid credentials',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: 'Unsuccessful login',
      });
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const secret =
    process.env.JWT_SECRET || 'become a little bit better everyday';
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, secret, options);
}
module.exports = router;
