const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String, //email type checker to be added
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  communicationMedium: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
    required: true,
  },
  dob: {
    type: Date, //Pipes needs to be used for getting the dates format
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  socialSecurityNumber: {
    type: Number, //Needs to take in total 9 digits( format - 000-00-0000)
    required: true,
  },
});

const User = mongoose.model("USER", userSchema);

module.exports = User;
