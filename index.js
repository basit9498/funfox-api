const express = require('express');
const bodyParse = require('body-parser');
const moogooes = require('mongoose');

require('dotenv').config();

const errorHandler = require('./app/middlewares/errorHandler');
const authRouter = require('./app/routes/auth.routes');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParse.json()); // for parsing application/json
app.use(bodyParse.urlencoded({ extended: true }));

app.use(`${process.env.API_VERSION}/auth`, authRouter);

app.use(errorHandler);

moogooes
  .connect(process.env.MONGODB_URI)
  .then((connection) => {
    app.listen(PORT, () => {
      console.log(`Server has been connected with port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('err', err);
  });
