const Student = require('../models/student');
const Book = require('../models/book');

module.exports = {
  sortBook: async (req, res, next) => {
    // 4. Get list of books from the DB with ability to sort books by availability, highest issued books, rent price
    try {
      const sort = req.query.sort;
      const books = await Book.find().sort({ [sort]: 1 })
      res.status(200).json({ books });
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  },
  createBook: async (req, res, next) => {
    // 2. Create book API that should add new book in the mongoDb schema
    try {
      const book = new Book({
        ...req.body
      })
      const savedBook = await book.save()
      res.status(200).json({ message: "Book created", book: savedBook })
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  },
  searchBook: async (req, res, next) => {
    // 6. Search library book(s) by name, code and language
    try {
      const book = await Book.find({ name: req.params.name, ISBN: req.params.ISBN, language: req.params.language })
      if (!book.length) {
        throw new Error('NOT_FOUND');
      }
      res.status(200).json({ book });
    }
    catch (error) {
      next(error)
    }
  },
  updateBook: async (req, res, next) => {
    // 9. API to update book by id.
    try {
      const book = await Book.updateOne({ _id: req.params.bookId }, { $set: { ...req.body } })
      res.status(200).json(book);
    } catch (err) {
      /* istanbul ignore next */
      next(err)
    }
  },
  searchStudent: async (req, res) => {
    // 11. Get students by matching books (Take book(s) id)
    try {
      const students = await Student.find({ 'bookRent.bookId': { $in: req.params.bookId } }).populate('bookRent.bookId').exec();
      if (!students.length) {
        throw new Error('NOT_FOUND');
      }
      res.status(200).json({ students });
    }
    catch (error) {
      next(error)
    }
  }
}