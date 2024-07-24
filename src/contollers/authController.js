const { default: mongoose } = require('mongoose');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { sign } = require('jsonwebtoken');
const AppError = require('../utils/appError');

const createToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIERS_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log(process.env.JWT_SECRET);
  const newUser = await User.create(req.body);
  const token = createToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    user: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Enetr Email and Password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!email || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email and password...', 400));
  }
  const token = createToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
});
