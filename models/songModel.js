const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
const songSchema = new Schema({
  song: {
    type: String,
    // required: "Không được để trống",
  },
  author: {
    type: String,
  },
  mobile: {
    type: String,
    // required: "Không được để trống",
  },
  view: {
    type: Number,
  },
});

module.exports = mongoose.model("Song", songSchema);
