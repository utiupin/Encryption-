//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// добавляем шифрование (взято из доков модуля mongoose-encryption)


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);



app.get('/', (req, res)=>{
  res.render('home')
});

app.get('/register', (req, res)=>{
  res.render('register')
});




app.get('/login', (req, res)=>{
  res.render('login')
});

app.post('/register', (req, res)=>{
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save((err)=>{
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.post('/login', (req, res)=>{

  User.findOne({email: req.body.username}, (err, foundUser)=>{
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === req.body.password) {
          res.render('secrets');
        } else {
          res.send("wrong password");
        }
      } else {
        res.send("user does not exist");
      }

    }
  });

});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
