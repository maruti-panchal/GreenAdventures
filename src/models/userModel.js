const mongoose = require('mongoose');
const validator = require('validator');
const bycrypt = require('bcrypt');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name Required'],
  },
  email: {
    type: String,
    required: [true, 'User email Required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Enter valid email Required'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password Required'],
    minLength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'lead-guide', 'guide'],
    default: 'user',
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password Required'],
  },
  changedPassword: Date,
  resetPassword: String,
  resetPasswordExpiers: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bycrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.changedPassword = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// this insatnce method is not workin need to check onec again
userSchema.methods.correctPassword = async function (
  plainpassword,
  encryptedPassword
) {
  return await bycrypt.compare(plainpassword, encryptedPassword);
};

userSchema.methods.isChangedPassword = function (enteredPassword) {
  if (this.changedPassword) {
    const updatedPassword = parseInt(this.changedPassword.getTime() / 1000, 10);
    return updatedPassword > enteredPassword;
  }
  return false;
};

userSchema.methods.resetPasswordToken = function () {
  // create token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // encrytp token to stor in db
  this.resetPassword = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // set token expier date
  this.resetPasswordExpiers = Date.now() + 10 * 60 * 1000;
  console.log(resetToken);
  console.log(this.resetPassword);
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
