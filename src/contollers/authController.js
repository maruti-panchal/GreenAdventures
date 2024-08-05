const { default: mongoose } = require('mongoose');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { sign } = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { sendEmail } = require('../utils/email');
const { stat } = require('fs');

const createToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIERS_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  const cookieOptions = {
    expiers: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIERS_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  user.password = undefined;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // find user with give id
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User not found with this email id....', 404));
  }

  // create token
  const resetToken = user.resetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // send token
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your Password?Submit a PATH request with your new password and passwordConfirm to:${resetURL}.\nIf you didn't forgot your password,please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password token',
      message,
    });
    res
      .status(200)
      .json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
    user.resetPassword = undefined;
    user.resetPasswordExpiers = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error send the email,Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPassword: hashedToken,
    resetPasswordExpiers: { $gt: Date.now() },
  });

  // If token has not expired,and is user,set the new password
  if (!user) {
    return next(new AppError('Token is expired...', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetPassword = undefined;
  user.resetPasswordExpiers = undefined;

  await user.save();
  // update changedPasswordAt property for the user

  // log the user in ,send jwt
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // gett user from collection
  const user = await User.findById(req.user.id).select('+password');
  if (!user)
    return next(new AppError('User not found with this email id...', 404));

  // check if posted crrent password is correct

  // This crrectpassword insatce method is not woring chech once again
  // const isUser = user.correctPassword(req.body.passwordCurrent, user.password);
  // if (!isUser) return next(new AppError('Incorrect Password...', 401));

  // If so,Update passworsd
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Log user in,send JWT
  createSendToken(user, 200, res);
});
