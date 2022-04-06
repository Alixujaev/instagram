const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");


router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  console.log(name, email, password);
  if (!email || !password || !name) {
    return res.json({ error: "Пожалуйста, заполните все поля" });
  }
  User.findOne({ name: name }).then((savedUser) => {
    if (savedUser) {
      return res.json({
        error: "Это имя пользователя уже занято. Попробуйте другое.",
      });
    }

    bcrypt.hash(password, 10).then((hashedPass) => {
      const user = new User({
        email,
        name,
        password: hashedPass,
        pic,
      });
      user
        .save()
        .then((user) => {
          res.json({ msg: "Siz muvaffaqiyatli ro'yhatdan o'tdingiz" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
    
  });
});

router.post("/signin", (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    res
      .status(422)
      .json({
        error: "Пожалуйста, добавьте имя пользователя или пароль",
      });
  }

  User.findOne({ name }).then((savedUser) => {
    if (!savedUser) {
      return res
        .status(422)
        .json({ error: "Неверный имя пользователя или пароль" });
    }

    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, following, followers, pic } = savedUser;
          res.json({ token: token, user: { _id, name, email, followers, following, pic } });
        } else {
          return res
            .status(422)
            .json({ error: "Неверный имя пользователя или пароль" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
