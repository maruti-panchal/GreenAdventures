const express = require('express');

const database = require('./db');
const router = require('./src/routes/toursRoute');
const userRouter = require('./src/routes/userRoutes');
const AppError = require('./src/utils/appError');
const globalErrorController = require('./src/contollers/errorController');
const app = express();

app.use(express.json());
database();

const PORT = process.env.PORT || 4000;

app.use('/api/v1/tours', router);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorController);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
