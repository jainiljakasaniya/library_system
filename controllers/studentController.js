const moment = require('moment');
const Student = require('../models/student');

module.exports = {
  sortStudent: async (req, res, next) => {
    // 3. Get list of students from the DB with the ability to sort students by their name, email, age
    try {
      const sort = req.query.sort;
      const students = await Student.find().sort({ [sort]: 1 });
      res.status(200).json({ students });
    } catch (error) {
      /* istanbul ignore next */
      next(error)
    }
  },
  createStudent: async (req, res, next) => {
    // 1. Create student API that should add new student in the mongoDb schema
    try {
      const student = new Student({
        ...req.body
      })
      const savedStudent = await student.save()
      res.status(200).json({ message: "Student created", student: savedStudent })
    } catch (error) {
      /* istanbul ignore next */
      next(error)
    }
  },
  expiredBook: async (req, res, next) => {
    // 7. Get students whose book rent expiry date is coming in next three days' excluding today (with book details)
    try {
      const students = await Student.find({
        'bookRent.rentDate': {
          $gt: moment().add(1, 'days').toDate(),
          $lt: moment().add(3, 'days').toDate()
        }
      }).populate('bookRent.bookId').exec();
      res.status(200).json({ students });
    }
    catch (error) {
      /* istanbul ignore next */
      next(error)
    }
  },
  updateStudent: async (req, res, next) => {
    // 8. API to Update student by id that should update student details in the DB
    try {
      const student = await Student.updateOne({ _id: req.params.studentId }, { $set: { ...req.body } })
      if(!student.modifiedCount) {
        throw new Error('NOT_FOUND')
      }
      res.status(200).json({ student });
    } catch (error) {
      next(error)
    }
  },
  addStudentBook: async (req, res, next) => {
    //12. API to add book(s) for particular student
    try {
      const student = await Student.updateOne({ _id: req.params.studentId }, { $push: { bookRent: { ...req.body } } });
      if(!student.modifiedCount) {
        throw new Error('NOT_FOUND')
      }
      res.status(200).json({ student });
    }
    catch (error) {
      next(error)
    }
  },
  searchStudent: async (req, res, next) => {
    // 5. Search student(s) by name and email
    try {
      const student = await Student.find({ name: req.params.name, email: req.params.email })
      if (!student.length) {
        throw new Error('NOT_FOUND');
      }
      res.status(200).json({ student });
    }
    catch (error) {
      next(error);
    }
  },
  updateRentDate: async (req, res, next) => {
    // 10. API to update rent date from student.
    try {
      // console.log({ _id: req.params.studentId, "bookRent.bookId": req.params.bookId }, { $set: { "bookRent.$.rentDate": req.body.rentDate } });
      const student = await Student.updateOne({ _id: req.params.studentId, "bookRent.bookId": req.params.bookId }, { $set: { "bookRent.$.rentDate": req.body.rentDate } }, { new: true });
      if(!student.modifiedCount) {
        throw new Error('NOT_FOUND')
      }
      res.status(200).json({ student });
    } catch (error) {
      next(error)
    }
  },
  deleteBooks: async (req, res, next) => {
    // 13. API to remove book(s) for particular student
    try {
      const student = await Student.updateOne({ _id: req.params.studentId }, { $pull: { bookRent: { bookId: req.params.bookId } } }, { new: true });
      if(!student.modifiedCount) {
        throw new Error('NOT_FOUND')
      }
      res.status(200).json({ student });
    } catch (error) {
      next(error);
    }
  }
};