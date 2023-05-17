const Joi = require('joi')

module.exports = {
  studentSchema: Joi.object({
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email({ tlds: { allow: false } }).required(),
      age: Joi.number().required(),
      phoneNo: Joi.number().min(1000000000).max(9999999999).optional(),
      gender: Joi.string().length(1).optional(),
      dob: Joi.date().less(new Date()).optional(),
      city: Joi.string().optional(),
      enrollmentNo: Joi.number().min(1000000000).max(9999999999).optional(),
      bookRent: Joi.array().items(Joi.object({
        bookId: Joi.string().optional(),
        rentDate: Joi.date().optional(),
      }).unknown(true))
    }).unknown(true)
  }).unknown(true),
  bookSchema: Joi.object({
    body: Joi.object({
      ISBN: Joi.string().length(5).required(),
      name: Joi.string().min(1).required(),
      rentPrice: Joi.number().required(),
      issueCount: Joi.number().optional(),
      availability: Joi.boolean().optional(),
      language: Joi.string().required()
    }).unknown(true)
  }).unknown(true),
  sortBookSchema: Joi.object({
    query: Joi.object({
      sort: Joi.string().valid('availability', 'issueCount', 'rentPrice').required(),
    }).unknown(true)
  }).unknown(true),
  sortStudentSchema: Joi.object({
    query: Joi.object({
      sort: Joi.string().valid('name', 'email', 'age').required(),
    }).unknown(true)
  }).unknown(true),
  updateBookSchema: Joi.object({
    body: Joi.object({
      ISBN: Joi.string().length(5).optional(),
      name: Joi.string().min(1).optional(),
      rentPrice: Joi.number().optional(),
      issueCount: Joi.number().optional(),
      availability: Joi.boolean().optional(),
      language: Joi.string().optional()
    }).unknown(true)
  }).unknown(true),
  updateStudentSchema: Joi.object({
    body: Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().email({ tlds: { allow: false } }).optional(),
      age: Joi.number().optional(),
      phoneNo: Joi.number().min(1000000000).max(9999999999).optional(),
      gender: Joi.string().length(1).optional(),
      dob: Joi.date().less(new Date()).optional(),
      city: Joi.string().optional(),
      enrollmentNo: Joi.number().min(1000000000).max(9999999999).optional(),
      bookRent: Joi.array().items(Joi.object({
        bookId: Joi.string().optional(),
        rentDate: Joi.date().optional(),
      }).unknown(true))
    }).unknown(true)
  }).unknown(true),
  newbookSchema: Joi.object({
    body: Joi.object({
      bookId: Joi.string().required(),
      rentDate: Joi.date().required()
    }).unknown(true)
  }).unknown(true),
  searchStudentSchema: Joi.object({
    params: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email({ tlds: { allow: false } }).required(),
    }).unknown(true)
  }).unknown(true),
  rentDateSchema: Joi.object({
    body: Joi.object({
      rentDate: Joi.date().required()
    }).unknown(true)
  }).unknown(true),
  searchBookSchema: Joi.object({
    params: Joi.object({
      name: Joi.string().min(1).required(),
      ISBN: Joi.string().length(5).required(),
      language: Joi.string().required()
    }).unknown(true)
  }).unknown(true)
}