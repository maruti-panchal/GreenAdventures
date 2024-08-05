const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// FILTERING UNWANTED FIELDS
const filterObject = (obj, ...restObject) => {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (restObject.includes(ele)) {
      newObj[ele] = obj[ele];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('You can not update password from this page...', 404)
    );
  }
  const filterBody = filterObject(req.body, 'name', 'email');
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success11111',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ status: 'success', users });
});
