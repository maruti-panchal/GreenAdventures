const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const database = require('./db');
const router = require('./src/routes/toursRoute');
const userRouter = require('./src/routes/userRoutes');
const AppError = require('./src/utils/appError');
const globalErrorController = require('./src/contollers/errorController');
database();
//Set security HTTP headers

const app = express();
app.use(helmet());
// create limit to hit request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP,Please try again later in an hour!',
});
app.use('/api', limiter);

// body parser,reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data sanitiaztion against NoSql quer injection
app.use(mongoSanitize());

//
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
//
app.use(express.static(`${__dirname}/public`));

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
