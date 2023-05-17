const express = require('express');
const mongoose = require("mongoose");

const studentRoutes = require("./routes/students");
const bookRoutes = require("./routes/books");
const authenticationRoute = require("./routes/authentication");
const errorConstatnt = require("./middleware/error");
const logger = require('./middleware/logger')

const app = express();

// app config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// db config
const DB_URL = 'mongodb://127.0.0.1:27017/library';
mongoose.set('strictQuery', false);
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const con = mongoose.connection
con.on('open', () => {
  console.log('connected...')
})

// logger
app.use(logger);

//Routes
app.use('/student', studentRoutes);
app.use('/book', bookRoutes);
app.use('/auth', authenticationRoute)

// Catch HTTP 404 
app.use((req, res, next) => {
  next(new Error('NOT_FOUND'));
})

// error handing
app.use((err, req, res, next) => {
  console.error(err);
  const errorObj = errorConstatnt[err.message] || errorConstatnt.INTERNAL_SERVER_ERROR;
  console.log('errorObj :>> ', errorObj);
  res.status(errorObj.status).json({
    message: errorObj.message
  })
});


// if(!module.parent){
//   app.listen(8000, () => console.log(`Server started on port ${8000}`));
// }

app.listen(8000, () => console.log(`Server started on port ${8000}`));

module.exports = app;