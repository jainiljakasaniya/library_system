const mongoose = require('mongoose');
const validator = require('validator')

const studentSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },
  age: { type: Number, required: true },
  phoneNo: Number,
  gender: String,
  dob: Date,
  city: String,
  enrollmentNo: Number,
  bookRent: [{
    bookId: { type: mongoose.Types.ObjectId, default: null, ref: 'Book' },
    rentDate: { type: Date, default: null },
  }]
});

module.exports = mongoose.model('Student', studentSchema);

// {
//     "name" : "jainil",
//     "email": "jainil@gmail.com",
//     "age": 21,
//     "phoneNo": 1111111111,
//     "gender": "M",
//     "dob": "09/01/2001",
//     "city": "Surat",
//     "enrollmentNo": 2222222222,
//     "bookRent": [{
//         "bookId": [],
//         "rentDate": null
//     }]
// }