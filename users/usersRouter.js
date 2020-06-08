const express = require('express');
const Users = require('./usersModel.js');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Welcome to the Users Router! 🐣');
});

module.exports = router;
