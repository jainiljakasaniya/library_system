const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator')
const auth = require("../middleware/auth");
const studentController = require('../controllers/studentController');

router.route('/')
  .get(auth, validator('sortStudentSchema'), studentController.sortStudent)
  .post(auth, validator('studentSchema'), studentController.createStudent);

router.route('/expired')
  .get(auth, studentController.expiredBook);

router.route('/:studentId')
  .put(auth, validator('updateStudentSchema'), studentController.updateStudent);

router.route('/:studentId/book')
  .put(auth, validator('newbookSchema'), studentController.addStudentBook);

router.route('/name/:name/email/:email')
  .get(auth, validator('searchStudentSchema'), studentController.searchStudent);

router.route('/:studentId/book/:bookId')
  .put(auth, validator('rentDateSchema'), studentController.updateRentDate)
  .delete(auth, studentController.deleteBooks)

module.exports = router;