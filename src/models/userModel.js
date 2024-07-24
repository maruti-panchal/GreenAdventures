const mongoose = require('mongoose');
const validator = require('validator');
const bycrypt = require('bcrypt');
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
  passwordConfirm: {
    type: String,
    required: [true, 'Password Required'],
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

userSchema.methods.correctPassword = async function (
  plainpassword,
  encryptedPassword
) {
  return await bycrypt.compare(plainpassword, encryptedPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
