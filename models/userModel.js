const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true},
  password: String,
  token: String
})

module.exports = mongoose.model("user", userSchema)