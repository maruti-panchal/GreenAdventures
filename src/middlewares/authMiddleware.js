const { verify } = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.isLogged = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in .....', 401));
  }
  const decode = verify(token, process.env.JWT_SECRET);
  const freshUser = await User.findOne(decode.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to this token does no longer exits')
    );
  }
  
  next();
};
