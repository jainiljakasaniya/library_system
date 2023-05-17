const jwt = require("jsonwebtoken");

const TOKEN_KEY = 'secretKey';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new Error('BAD_REQUEST'));
  }
  try {
    jwt.verify(token, TOKEN_KEY);
    return next();
  } catch (err) {
    next(new Error('UNAUTHORIZED'));
  }
};

module.exports = verifyToken;