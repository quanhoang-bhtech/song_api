const mongoose = require("mongoose");
const { MONGO_URL } = process.env;

exports.connect = ()=>{
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>{
      console.log("connect db successfully");
    })
    .catch((error) => {
      console.log(error);
    })
}
