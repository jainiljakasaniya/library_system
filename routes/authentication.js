const express = require('express');
const router = express.Router();
const TOKEN_KEY = 'secretKey';
const jwt = require("jsonwebtoken");

router.route('/')
  .get(async (req, res) => {
    // Generate Token.
    jwt.sign({ msg: "Grant Access." }, TOKEN_KEY, (err, token) => {
      res.status(200).json({
        msg: "Welcome... !!",
        token
      });
    });
  })

module.exports = router;