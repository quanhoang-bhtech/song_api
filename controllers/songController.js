const songModel = require('../models/songModel')
const userModel = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
// const { create } = require('../models/songModel');

const path = require('path');
const xlsx = require("node-xlsx");
const fs = require("fs");
// const storage = multer.memoryStorage();
const multer = require("multer");
const upload = multer({ dest: 'uploads/' })

exports.insertRecord = async function (req, res) {
  console.log("chay vao day");
  try {
    const song = new Song({
      song: req.body.song,
      author: req.body.author,
      mobile: req.body.mobile,
      view: req.body.view,
    });
    await song.save();
    res.json(song);
  } catch (error) {
    res.send(error);
  };
};

exports.importRecord = async function(req, res) {
  try {
    const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(req.file.path));
  // console.log(workSheetsFromBuffer);
    const [a] = workSheetsFromBuffer;
    const arrayData = [];
    for (let i = 0; i < a.data.length; i++) {
      const element = a.data[i];
      const song = a.data[i][0];
      const author = a.data[i][1];
      const mobile = a.data[i][2];
      const view = a.data[i][3];
      const objectData = {
        song,
        author,
        mobile,
        view,
      };
      arrayData.push(objectData);
    }
    arrayData.shift();
    async function insertFromExcel(data) {
      const song = new songModel(data);
      await song.save();
    }
    res.json(arrayData)
    for (let index = 0; index < arrayData.length; index++) {
      insertFromExcel(arrayData[index]);
    }
    
  } catch (error) {
    console.log(error);
  }
 
}

exports.updateRecord = async function (req, res) {
  try {
    let id = req.params.id;
    let { song, author, mobile, view } = req.body;
    let updateSong = await songModel.updateOne(
      {_id: id},
      {
        song: song,
        author: author,
        mobile: mobile,
        view: view
      }
    );
    let record = await songModel.findById({_id: id})
    res.status(200).json(record);
  } catch (error) {
    console.log(error);
  }
}

exports.deleteRecord = async function (req, res) {
  try {
    let id = req.params.id;
    let deleteRecord = await songModel.deleteOne({
      _id: id
    })
    res.status(200).send('xoa thanh cong');
  } catch (error) {
    res.status(500).json(error)
  }
}


exports.listRecord = async function(req, res) {
  let perPage = 3;
  let page = parseInt(req.params.page) || 1;
  let ki = perPage * page - perPage;
  const view = { view: -1};
  const song = { song: 1 };
  const count = await (await songModel.find()).length;
  const data1 = await songModel.find().sort(view).skip(ki).limit(perPage);
  const data2 = await songModel.find().sort(song).skip(ki).limit(perPage);
  const data3 = await songModel.find().skip(ki).limit(perPage);
  const b = req.query.q;
  const data = (b == "v") ? data1 : (b == "s") ? data2 : data3;
  const pages = Math.ceil(count / perPage);
  const arrayPages = [];
  for (let index = 1; index <= pages; index++) {
    arrayPages.push(index);
  }
  res.json(
    {
    list: data,
    perPage,
    maxPgae: pages,
    current: page,
    total: count,
  });
};
exports.register = async function(req, res) {
  try {
      const { firstName, lastName, email, password } = req.body;
      if (!(firstName && lastName && email && password )) {
          res.status(400).send("All field not null")
      }
      const oldUser = await userModel.findOne({email});
      if(oldUser){
          return res.status(400).send("User already exit")
      }

  encryptedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
  });
  const token = jwt.sign(
  { user_id: user._id, email },
  process.env.TOKEN_KEY,
  {
      expiresIn: "1h",
  }
  );
  // save token
  user.token = token;

  res.status(201).json(user)
  } catch (error) {
      console.log(error);
  }
}

exports.login = async function(req, res) {
  try {
      const { email, password } = req.body;
      if (!(email && password)) {
          res.status(400).send("Email & password can not null");
      }
      const user = await userModel.findOne({email});
      if (user && (await bcrypt.compare(password, user.password))){
          const token = jwt.sign(
              { user_id: user._id, email},
              process.env.TOKEN_KEY,
          {
              expiresIn: "1h"
          }
          );
          user.token = token;
          res.status(200).json(user);
      }
      else{
          res.json("Thong tin dang nhap khong hop le")
      }
  } catch (error) {
      console.log(error);
  }
}

