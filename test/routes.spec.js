/* istanbul ignore file */

const chai = require('chai');
const chaiHttp = require('chai-http');
const rewire = require('rewire');
const mongoose = require('mongoose');

const expect = chai.expect;

chai.use(chaiHttp);

let app = rewire('../index');

describe('Testing express app routes', () => {

  let sampleStudentVal, sampleBookVal, token;

  describe('Testing /auth routes',  () => {

    it('GET / should successfully return token.', async () => {
      return chai.request(app)
        .get('/auth')
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('msg');
          expect(response.body).to.have.property('token');
          token = response.body.token;
        })
    })
  })

  describe('Testing /student routes', () => {

    describe('Testing / routes', () => {

      beforeEach(() => {
        sampleStudentVal = {
          name: `Jay${Math.random()}`,
          email: `Jay${Math.random()}@gmail.com`,
          age: 21,
          phoneNo: 1111111111,
          gender: "M",
          dob: "2001-08-19T18:30:00.000Z",
          city: "Surat",
          enrollmentNo: 2222222222,
          bookRent: [{
            bookId: mongoose.ObjectID,
            rentDate: "2023-02-07T18:30:00.000Z"
          }]
        };
      });

      it('GET / should return bad request error.', async () => {
        return chai.request(app)
          .get('/student?sort=name')
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET / should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .get('/student?sort=name')
          .set('Authorization', token + "12")
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET / should successfully return student array', async () => {
        return chai.request(app)
          .get('/student?sort=name')
          .set('Authorization', token)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('students').to.be.an('array');
          });
      });

      it('POST / should return bad request error.', async () => {
        return chai.request(app)
          .post('/student/')
          .send(sampleStudentVal)
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('POST / should return Invalid Authentication error.',async () => {
        return chai.request(app)
          .post('/student')
          .set('Authorization', token + "12")
          .send(sampleStudentVal)
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('POST / should return validation error.',async () => {
        sampleStudentVal.phoneNo = 11111111111;
        return chai.request(app)
          .post('/student')
          .set('Authorization', token)
          .send(sampleStudentVal)
          .then((response) => {
            expect(response.status).to.equal(400);
            console.log(response.body)
            expect(response.body).to.be.an('array');;
          });
      });
      it('POST / should successfully create student', async () => {
        return chai.request(app)
          .post('/student/')
          .set('Authorization', token)
          .send(sampleStudentVal)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message').to.equal('Student created');
            expect(response.body).to.have.property('student');
          });
      })

    });

    describe('Testing /expired routes', () => {

      it('GET /expired should return bad request error.', async () => {
        return chai.request(app)
          .get('/student/expired')
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET /expired should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .get('/student/expired')
          .set('Authorization', token + "12")
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET /expired should successfully return student array.', async () => {
        return chai.request(app)
          .get('/student/expired')
          .set('Authorization', token)
          .then((response) => {
            expect(200);
            expect(response.body).to.have.property('students');
          });
      });

    });

    describe('Testing /:studentId routes', () => {

      beforeEach(() => {
        sampleStudentVal = {
          age: `${Math.floor(Math.random() * 90 + 10)}`
        };
      });

      it('PUT /:studentId should return bad request error.', async () => {
        return chai.request(app)
          .put('/student/63ea0777999b205acf9ccf5b')
          .send(sampleStudentVal)
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('PUT /:studentId should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .put('/student/63ea0777999b205acf9ccf5b')
          .set('Authorization', token + "12")
          .send(sampleStudentVal)
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('PUT /:studentId should return Not Found error.', async () => {
        return chai.request(app)
          .put('/student/63ea0777999b205acf9ccf6b')
          .set('Authorization', token)
          .send(sampleStudentVal)
          .then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message');
          });
      });
      it('PUT /:studentId should successfully update student record.', async () => {
        return chai.request(app)
          .put('/student/63f5edbf628e64eaad6313fd')
          .set('Authorization', token)
          .send(sampleStudentVal)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('student').to.have.property('modifiedCount').to.not.equal(0);;
          });
      });

    });

    describe('Testing /:studentId/book routes', () => {

      beforeEach(() => {
        sampleBookVal = {
          bookId: "63e5cbe305082ce294277dbc",
          rentDate: "02/15/2023"
        };
      });

      it('PUT /:studentId/book should return bad request error.', async () => {
        return chai.request(app)
          .put('/student/63ea0777999b205acf9ccf5b/book')
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('PUT /:studentId/book should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .put('/student/63ea0777999b205acf9ccf5b/book')
          .set('Authorization', token + "12")
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('PUT /:studentId/book should return Not Found error.', async () => {
        return chai.request(app)
          .put('/student/63ea09788afbba3a1f66d8c9/book')
          .set('Authorization', token)
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message');
          });
      });
      it('PUT /:studentId/book should successfully add book into student record.', async () => {
        return chai.request(app)
          .put('/student/63ea0777999b205acf9ccf5b/book')
          .set('Authorization', token)
          .send(sampleBookVal)
          .then((response) => {
            expect(200);
            expect(response.body).to.have.property('student');
            expect(response.body).to.have.property('student').to.have.property('modifiedCount').to.not.equal(0);
          });
      });

    });

    describe('Testing /name/:name/email/:email routes', () => {

      it('GET /name/:name/email/:email should return bad request error.', async () => {
        return chai.request(app)
          .get('/student/name/jainil/email/jainil@gmail.com')
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET /name/:name/email/:email should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .get('/student/name/jainil/email/jainil@gmail.com')
          .set('Authorization', token + "12")
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET /name/:name/email/:email should return Not Found error.', async () => {
        return chai.request(app)
          .get('/student/name/Abhi/email/jainil@gmail.com')
          .set('Authorization', token)
          .then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET /name/:name/email/:email should successfully return student array', async () => {
        return chai.request(app)
          .get('/student/name/jainil/email/jainil@gmail.com')
          .set('Authorization', token)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('student').to.be.an('array');
          });
      });

    });

    describe('Testing /:studentId/book/:bookId routes', () => {

      beforeEach(() => {
        sampleBookVal = {
          rentDate: `${new Date().toISOString()}`,
        };
      });

      it('PUT /:studentId/book/:bookId should return bad request error for token.', async () => {
        return chai.request(app)
          .put('/student/63ea0777999b205acf9ccf5b/book/63e5cbe305082ce294277dbc')
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('PUT /:studentId/book/:bookId should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .put('/student/63ea0777999b205acf9ccf5b/book/63e5cbe305082ce294277dbc')
          .set('Authorization', token + "12")
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('PUT /:studentId/book/:bookId should successfully update student book rent date.', async () => {
        return chai.request(app)
          .put('/student/63ea0777999b205acf9ccf5b/book/63e5cc7b05082ce294277dbe')
          .set('Authorization', token)
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('student');
            expect(response.body).to.have.property('student').to.have.property('modifiedCount').to.not.equal(0);
          });
      });
      it('PUT /:studentId/book/:bookId should return Not Found error.', async () => {
        return chai.request(app)
          .put('/student/63f83cc7c4e0aab23f386ead/book/63e5cc7b05082ce294277dbe')
          .set('Authorization', token)
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message');
          });
      });

      it('DELETE /:studentId/book/:bookId should return bad request error for token.', async () => {
        return chai.request(app)
          .delete('/student/63ea0777999b205acf9ccf5b/book/63e5cbe305082ce294277dbc')
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('DELETE /:studentId/book/:bookId should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .delete('/student/63ea0777999b205acf9ccf5b/book/63e5cbe305082ce294277dbc')
          .set('Authorization', token + "12")
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('DELETE /:studentId/book/:bookId should delete book for specific student.', async () => {
        return chai.request(app)
          .delete('/student/63ea0777999b205acf9ccf5b/book/63e5cbe305082ce294277dbc')
          .set('Authorization', token)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('student');
          });
      });
      it('DELETE /:studentId/book/:bookId should return book not found.', async () => {
        return chai.request(app)
          .delete('/student/63ea0777999b205acf9ccf5b/book/63e5cbe305082ce294288dbc')
          .set('Authorization', token)
          .then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message');
          });
      });

    });

  });

  describe('Testing /book routes', () => {

    describe('Testing / routes', () => {

      beforeEach(() => {
        sampleBookVal = {
          ISBN: `${Math.floor(Math.random()*90000) + 10000}`,
          name: "Magic",
          rentPrice: 20,
          language: "Gujarati"
        };
      });

      it('GET / should return bad request error.', async () => {
        return chai.request(app)
          .get('/book?sort=rentPrice')
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET / should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .get('/book?sort=rentPrice')
          .set('Authorization', token + "12")
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET / should successfully return book array', async () => {
        return chai.request(app)
          .get('/book?sort=rentPrice')
          .set('Authorization', token)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('books').to.be.an('array');
          });
      });

      it('POST / should return bad request error.', async () => {
        return chai.request(app)
          .post('/book/')
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('POST / should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .post('/book/')
          .set('Authorization', token + "12")
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');

          });
      });
      it('POST / should successfully create book.', async () => {
        return chai.request(app)
          .post('/book')
          .set('Authorization', token)
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('book');
          });
      })

    });

    describe('Testing /name/:name/ISBN/:ISBN/language/:language routes', () => {

      it('GET / should return bad request error.', async () => {
        return chai.request(app)
          .get('/book/name/Wings of Fire/ISBN/12121/language/Hindi')
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET / should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .get('/book/name/Wings of Fire/ISBN/12121/language/Hindi')
          .set('Authorization', token + "12")
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET / should return not found error.', async () => {
        return chai.request(app)
          .get('/book/name/hello/ISBN/85426/language/Tamil')
          .set('Authorization', token)
          .then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET / should successfully return book.', async () => {
        return chai.request(app)
          .get('/book/name/Wings of Fire/ISBN/12121/language/Hindi')
          .set('Authorization', token)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('book');
          });
      });

    });

    describe('Testing /:bookId routes', () => {

      beforeEach(() => {
        sampleBookVal = {
          rentPrice: 50,
        };
      });

      it('PUT /:bookId should return bad request error.', async () => {
        return chai.request(app)
          .put('/book/63e5cc7b05082ce294277dbe')
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('PUT /:bookId should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .put('/book/63e5cc7b05082ce294277dbe')
          .set('Authorization', token + "12")
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      it('PUT /:bookId should successfully return update book.', async () => {
        return chai.request(app)
          .put('/book/63e5cc7b05082ce294277dbe')
          .set('Authorization', token)
          .send(sampleBookVal)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('modifiedCount');
          });
      });
    });

    describe('Testing /:bookId/students routes', () => {

      it('GET /:bookId/students should return bad request error.', async () => {
        return chai.request(app)
          .get('/book/63e5cc7b05082ce294277dbe/students')
          .then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
          });
      });
      it('GET /:bookId/students should return Invalid Authentication error.', async () => {
        return chai.request(app)
          .get('/book/63e5cc7b05082ce294277dbe/students')
          .set('Authorization', token + "12")
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('message');
          });
      });
      // it('GET /:bookId/students should return not found error.', async () => {
      //   return chai.request(app)
      //     .get('/book/6409689ab3b631fd566c3176/students')
      //     .set('Authorization', token)
      //     .then((response) => {
      //       expect(response.status).to.equal(404);
      //       expect(response.body).to.have.property('message');
      //     });
      // });
      it('GET /:bookId/students should successfully return student array', async () => {
        return chai.request(app)
          .get('/book/63e5cc7b05082ce294277dbe/students')
          .set('Authorization', token)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('students').to.be.an('array');
          });
      });
    });

  });

  describe('Testing invalid Route', () => {
    it('should successfully return Not Found error', async () => {
      return chai.request(app)
        .get('/hello')
        .set('Authorization', token)
        .then((response) => {
          expect(response.status).to.equal(404);
          expect(response.body).to.have.property('message');
        })
    })
  });
  
})