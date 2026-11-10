import express from "express";
import { jwtDecode } from "jwt-decode";

import User from "../models/user";

const router = express.Router();

router.post("/signup", (req, res) => {
  const { credentials } = req.body;
  const user = new User({
    email: credentials.email,
    username: credentials.username,
    admin: false,
    role: "USR",
  });
  user.setPassword(credentials.password);
  user
    .save()
    .then((user) => {
      res.status(200).json({ user: user.toAuthJson() });
    })
    .catch((err) => res.status(400).json({ errors: err.errors }));
});

router.post("/login", (req, res) => {
  const { credentials } = req.body;
  User.findOne({ email: credentials.email }).then((user) => {
    if (user && user.passwordCheck(credentials.password)) {
      res.status(200).json({ user: user.toAuthJson() });
    } else {
      res
        .status(400)
        .json({ errors: { global: "Password Incorrect or User Not Found" } });
    }
  });
});

router.get("/getusers", (req, res) => {
  const users = [];
  try {
    var { admin } = jwtDecode(req.headers.authorisation);
  } catch (err) {
    res.status(400).json({ errors: "Authorisation Error" });
  }
  if (!admin) {
    res.status(400).json({ errors: "Authorisation Error" });
  }
  User.find({})
    .sort({ createdAt: 1 })
    .then((userList) => {
      userList.forEach((user) => {
        var newUser = {
          _id: user._id,
          email: user.email,
          username: user.username,
          admin: user.admin,
          role: user.role,
        };
        users.push(newUser);
      });
      res.status(200).json(users);
    })
    .catch((err) => res.status(400).json({ errors: err.errors }));
});

router.post("/makeadmin", (req, res) => {
  var { id, newRole } = req.body;
  console.dir(newRole);
  try {
    var { admin, role } = jwtDecode(req.headers.authorisation);
    console.dir(role);
  } catch (err) {
    res.status(400).json({ errors: "Authorisation Error" });
  }
  if (!admin) {
    res.status(400).json({ errors: "Authorisation Errors" });
  }
  User.findOne({ _id: id })
    .then((user) => {
      user.admin = !user.admin;
      user.save().then((newUser) => {
        res.status(200).json({ user: newUser });
      });
    })
    .catch((err) => res.status(400).json({ errors: err.errors }));
});

export default router;
