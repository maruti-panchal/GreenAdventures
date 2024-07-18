const express = require('express');

const database = require('./db');
const router = require('./src/routes/toursRoute');
const app = express();

app.use(express.json());
database();

const PORT = process.env.PORT || 4000;

app.use('/api/v1/tours', router);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
