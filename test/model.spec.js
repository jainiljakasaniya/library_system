/* istanbul ignore file */

const chai = require("chai");
const expect = chai.expect;
const mongoose = require("mongoose");
const ValidationError = mongoose.Error.ValidationError;

const Student = require("../models/student");
const Book = require("../models/book");

describe("Testing Student model", () => {
  let sampleStudentVal;

  beforeEach(() => {
    sampleStudentVal = {
      name: "jainil",
      email: "jainil@gmail.com",
      age: 21,
      phoneNo: 1111111111,
      gender: "M",
      dob: "09/01/2001",
      city: "Surat",
      enrollmentNo: 2222222222,
      bookRent: [
        {
          bookId: mongoose.ObjectID,
          rentDate: null,
        },
      ],
    };
  });

  it("it should throw an error due to missing fields", () => {
    let student = new Student();
    student.validate((err) => {
      expect(err.errors.name).to.exist;
      expect(err.errors.email).to.exist;
      expect(err.errors.age).to.exist;
    });
  });

  it("it should throw an error due to incorrect value", () => {
    let student = new Student(sampleStudentVal);
    student.email = "jainilgmailcom";
    student.validate((err) => {
      expect(err).to.be.instanceOf(ValidationError);
    });
  });

  it("it should create the student successfully with correct parameters", () => {
    let student = new Student({
      ...sampleStudentVal,
    });
    student.validate((response) => {
      expect(response);
    });
  });
});

describe("Testing Book model", () => {
  let sampleBookVal;

  beforeEach(() => {
    sampleBookVal = {
      ISBN: "78787",
      name: "Animal Farm",
      rentPrice: 30,
      issueCount: 2,
      availability: true,
      language: "French",
    };
  });

  it("it should throw an error due to missing fields", () => {
    let book = new Book();
    book.validate((err) => {
      expect(err.errors.ISBN).to.exist;
      expect(err.errors.name).to.exist;
      expect(err.errors.rentPrice).to.exist;
      expect(err.errors.language).to.exist;
    });
  });

  it("it should throw an error due to incorrect value.", () => {
    let book = new Book(sampleBookVal);
    book.ISBN = 12;
    book.validate((err) => {
        expect(err).to.be.instanceOf(ValidationError);
    });
  });

  it("it should create the book successfully with correct parameters", () => {
    let book = new Book({
      ...sampleBookVal,
    });
    book.validate((response) => {
      expect(response);
    });
  });
});
