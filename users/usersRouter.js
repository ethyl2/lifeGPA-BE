const express = require('express');
const Users = require('./usersModel.js');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const restricted = require('../auth/authMiddleware.js');
require('dotenv').config();

// GET /api/users
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Users Router! 🐣' });
});

// GET /api/users/all
// Get id, username, name, and email of all users
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

/* Onboarding */

// POST /api/users/register
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

// POST api/users/login
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

// Edit user
// PUT api/users/:id
router.put('/:id', restricted, (req, res) => {
  const id = req.params.id;
  Users.updateUser(id, req.body)
    .then((user) => {
      const user_to_return = {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      };
      res.status(200).json(user_to_return);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failed to update user with id ${id}.`,
      });
    });
});

// Delete user
// DELETE /api/users/:id
router.delete('/:id', restricted, (req, res) => {
  const { id } = req.params;
  Users.removeUser(id)
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({
          message: `Successfully deleted user with id ${id}`,
        });
      } else {
        res.status(404).json({
          message: `Failed to find user with id ${id} and therefore failed to delete user.`,
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err, message: `Failed to delete user with id ${id}.` });
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, secret, options);
}
module.exports = router;
