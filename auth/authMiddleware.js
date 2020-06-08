const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const secret =
    process.env.JWT_SECRET || 'become a little bit better everyday';
  if (authorization) {
    jwt.verify(authorization, secret, function (err, decodedToken) {
      if (err) {
        res.status(401).json({
          error: err,
          message: 'invalid token',
        });
      } else {
        req.token = decodedToken; // so anything downstream can access the data in the token
        next();
      }
    });
  } else {
    res.status(400).json({
      message: 'Needs authorization token present in header.',
    });
  }
};
