require("dotenv").config();
require("./models/db").connect();
const express = require('express');
const auth = require('./middleware/auth')
const router = require('./routes/songRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json('ok')
});
app.get('/home', auth, (req, res) => {
  res.send("xin chao")
})

app.use(express.json());

app.use('/', router);

app.listen(PORT, () =>{
  console.log("server is running");
})