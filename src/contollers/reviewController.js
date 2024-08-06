const Review = require('../models/reviewModel');
const catchAsynch = require('../utils/catchAsync');

exports.getAllReviews = catchAsynch(async (req, res, next) => {
  const reviews = await Review.find();
  res
    .status(200)
    .json({ status: 'success', result: reviews.length, data: { reviews } });
});

exports.createReview = catchAsynch(async (req, res, next) => {
  const newreview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newreview,
    },
  });
});
