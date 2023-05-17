const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator')
const auth = require("../middleware/auth");
const bookController = require('../controllers/bookController');

router.route('/')
  .get(auth, validator('sortBookSchema'), bookController.sortBook)
  .post(auth, validator('bookSchema'), bookController.createBook);

router.route('/name/:name/ISBN/:ISBN/language/:language')
  .get(auth, validator('searchBookSchema'), bookController.searchBook);

router.route('/:bookId')
  .put(auth, validator('updateBookSchema'), bookController.updateBook);

router.route('/:bookId/students')
  .get(auth, bookController.searchStudent);

module.exports = router;